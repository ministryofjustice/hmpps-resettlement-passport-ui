#!/usr/bin/env python
from playwright.sync_api import sync_playwright, Playwright
from zapv2 import ZAPv2
import time
import json
import os
import warnings


# Change to match the API key set in ZAP, or use None if the API key is disabled
zap_api_key = os.environ["ST_API_KEY"]
proxy_url = os.environ["ST_PROXY_URL"] # "http://localhost:8080"
username = os.environ["ST_USERNAME"] 
password = os.environ["ST_PASSWORD"] 

def run(playwright: Playwright):

    zap = ZAPv2(apikey=zap_api_key, proxies={'http': proxy_url})
    zap.core.exclude_from_proxy('https://sign-in-dev.hmpps.service.justice.gov.uk.*')

    chromium = playwright.chromium
    browser = chromium.launch(headless=True, proxy={"server": proxy_url})
    context = browser.new_context(ignore_https_errors=True)
    page = context.new_page()
    page.goto("https://resettlement-passport-ui-dev.hmpps.service.justice.gov.uk")
   

    page.locator('//*[@id="username"]').fill(username)
    page.locator('//*[@id="password"]').fill(password)
    page.locator('//*[@id="submit"]').click()
    assert page.inner_text('h1') == "All pathways overview"


    # Spider the target URL
    target_url = "https://resettlement-passport-ui-dev.hmpps.service.justice.gov.uk"

    print(f"Spidering target URL: {target_url}")

    zap.spider.scan(target_url)

    # Wait for the spider to finish
    time.sleep(5)
    
    # Wait for passive scanning to complete
    while int(zap.pscan.records_to_scan) > 0:
        print(f"Records to passive scan: {zap.pscan.records_to_scan}")
        time.sleep(20)

    # Start active scanning
    print("Starting active scan…")
    zap.ascan.scan(target_url)
    # Wait for the active scan to finish
    while int(zap.ascan.status()) < 100:
        print(f"Active Scan progress: {zap.ascan.status()}%")
        time.sleep(50)

    # Generate the report locally (not in pipeline)
    if (os.environ["ST_ENV_NAME"] != "dev"):
        print("Generating HTML report…")
        sec_report_html = zap.core.htmlreport()
        with open("test_results/zap_report.html", "w") as file:
            file.write(sec_report_html)

        print("Security scan completed successfully.")


    # Retrieve the alerts using paging in case there are lots of them
    risk_high = 0
    risk_medium = 0
    risk_low = 0
    risk_informational = 0
    st = 0
    pg = 5000
    alert_dict = {}
    alert_count = 0
    alerts = zap.alert.alerts(baseurl=target_url, start=st, count=pg)
    blacklist = [1,2]
    while len(alerts) > 0:
        print('Reading ' + str(pg) + ' alerts from ' + str(st))
        alert_count += len(alerts)
        for alert in alerts:
            plugin_id = alert.get('pluginId')
            if plugin_id in blacklist:
                continue
            if alert.get('risk') == 'High':
                risk_high += 1
                print('High level Alert :')
                print(alert)
                # Trigger any relevant postprocessing
                continue
            if alert.get('risk') == 'Medium':
                risk_medium += 1
                # Trigger any relevant postprocessing
                continue
            if alert.get('risk') == 'Low':
                risk_low += 1
                # Trigger any relevant postprocessing
                continue
            if alert.get('risk') == 'Informational':
                risk_informational += 1
                # Ignore all info alerts - some of them may have been downgraded by security annotations
                continue
        st += pg
        alerts = zap.alert.alerts(start=st, count=pg)
    print('Total number of alerts: ' + str(alert_count))
    print('Total number of high: ' + str(risk_high))
    print('Total number of medium: ' + str(risk_medium))
    print('Total number of low: ' + str(risk_low))
    print('Total number of informational: ' + str(risk_informational))

    # compare current results against previous run stored results:
    results = {
    "high": risk_high,
    "medium": risk_medium,
    "low": risk_low
    }

    browser.close()

    with open("security_test/previous_result.json") as f:
        previous_results = json.load(f)
    print('Previous results:')
    print(previous_results)


    # convert into JSON:
    result_publish = json.dumps(results)
    # the result is a JSON string:
    print('Current results:')
    print(result_publish)

    # fail test if any High risk items are reported.
    assert risk_high == 0


    # fail test if any changes to high or medium previous risk items are reported.
    assert results["high"] == previous_results["high"]
    assert results["medium"] == previous_results["medium"]


    if (results != previous_results):
        #prints if granular changes to low or warnings
        warnings.warn(UserWarning("current results are different to previous results"))
       
    print('Writing results to file')
    with open("security_test/previous_result.json", "w") as file:
        file.write(result_publish)


    

with sync_playwright() as playwright:
    run(playwright)
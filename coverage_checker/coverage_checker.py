import sys
import xml.etree.ElementTree as ET 

print("Running coverage check")
main_xml_tree = tree = ET.parse('/tmp/workspace/coverage/main_clover.xml')
main_root = tree.getroot()
main_coverage =  list(main_root.iter('metrics'))[0].attrib
main_statement_percent = (float(main_coverage['coveredstatements'])/float(main_coverage['statements']))*100
main_conditionals_percent = (float(main_coverage['coveredconditionals'])/float(main_coverage['conditionals']))*100
main_methods_percent = (float(main_coverage['coveredmethods'])/float(main_coverage['methods']))*100

current_xml_tree = tree = ET.parse('/tmp/workspace/clover.xml')
current_root = tree.getroot()
current_coverage =  list(current_root.iter('metrics'))[0].attrib
current_statement_percent = (float(current_coverage['coveredstatements'])/float(current_coverage['statements']))*100
current_conditionals_percent = (float(current_coverage['coveredconditionals'])/float(current_coverage['conditionals']))*100
current_methods_percent = (float(current_coverage['coveredmethods'])/float(current_coverage['methods']))*100

print(f"{main_statement_percent=}")
print(f"{current_statement_percent=}")
print(f"{main_conditionals_percent=}")
print(f"{current_conditionals_percent=}")
print(f"{main_methods_percent=}")
print(f"{current_methods_percent=}")


if main_statement_percent > current_statement_percent:
    print(f"Statement coverage has decreased from {main_statement_percent} to {current_statement_percent}")
    sys.exit(1)
if main_conditionals_percent > current_conditionals_percent:
    print(f"Conditionals coverage has decreased from {main_conditionals_percent} to {current_conditionals_percent}")
    sys.exit(1)
if main_methods_percent > current_methods_percent:
    print(f"Methods coverage has decreased from {main_methods_percent} to {current_methods_percent}")
    sys.exit(1)

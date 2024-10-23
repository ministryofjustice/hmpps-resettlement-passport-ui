import sys
import xml.etree.ElementTree as ET 


main_xml_tree = tree = ET.parse('/tmp/workspace/coverage/clover.xml')
main_root = tree.getroot()
main_coverage =  list(main_root.iter('metrics'))[0].attrib
main_statment_percent = (float(main_coverage['coveredstatements'])/float(main_coverage['statements']))*100
main_conditionals_percent = (float(main_coverage['coveredconditionals'])/float(main_coverage['conditionals']))*100
main_methods_percent = (float(main_coverage['coveredmethods'])/float(main_coverage['methods']))*100

current_xml_tree = tree = ET.parse('coverage/clover.xml')
current_root = tree.getroot()
current_coverage =  list(current_root.iter('metrics'))[0].attrib
current_statment_percent = (float(current_coverage['coveredstatements'])/float(current_coverage['statements']))*100
current_conditionals_percent = (float(current_coverage['coveredconditionals'])/float(current_coverage['conditionals']))*100
current_methods_percent = (float(current_coverage['coveredmethods'])/float(current_coverage['methods']))*100


print(f"{main_statment_percent=}")
print(f"{main_conditionals_percent=}")
print(f"{main_methods_percent=}")

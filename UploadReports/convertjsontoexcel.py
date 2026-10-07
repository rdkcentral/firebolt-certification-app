
##########################################################################
# If not stated otherwise in this file or this component's Licenses.txt
# file the following copyright and licenses apply:
#
# Copyright 2026 RDK Management
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
# http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#########################################################################

import pandas as pd
import json
import openpyxl

# Function to add serial numbers
def add_serial_numbers(data):
    for i, entry in enumerate(data, start=1):
        entry['index'] = i
    return data

def convert_json_to_excel(json_file_path,output_file_name):
    # Read JSON data from file
    with open(json_file_path, 'r') as file:
        json_data = json.load(file)

    # Extract data from results -> suites -> tests
    core_data = []
    manage_data = []

    for result in json_data.get('results', []):
        for suite in result.get('suites', []):
            suite_title = suite.get('title', '').upper()  # Convert to uppercase for case-insensitive comparison
            for test in suite.get('tests', []):
                entry = {
                    'title': test.get('title', ''),
                    'fullTitle': test.get('fullTitle', ''),
                    'state': test.get('state', ''),
                    'code': test.get('code', '')
                }
                if 'CORE' in suite_title:
                    core_data.append(entry)

                elif 'MANAGE' in suite_title:
                    manage_data.append(entry)

    # Add serial numbers
    core_data = add_serial_numbers(core_data)
    manage_data = add_serial_numbers(manage_data)

    # Convert to DataFrames
    core_df = pd.DataFrame(core_data)
    manage_df = pd.DataFrame(manage_data)

    # Reorder columns (move the last column to the first column)
    expected_columns = ['index', 'title', 'fullTitle', 'state', 'code']
    available_columns = [col for col in expected_columns if col in core_df.columns]
    core_df = core_df[available_columns]
#    core_df = core_df[['index', 'title', 'fullTitle', 'state', 'code']]
    manage_df =manage_df[available_columns]
#    manage_df = manage_df[['index', 'title', 'fullTitle', 'state', 'code']]

    # Create a Pandas Excel writer using XlsxWriter as the engine
    with pd.ExcelWriter(output_file_name, engine='xlsxwriter') as writer:
        # Write each dataframe to a different worksheet
        #core_df.to_excel(writer, sheet_name='CORE', index=False, startrow=1, header=False)
        #manage_df.to_excel(writer, sheet_name='MANAGE', index=False, startrow=1, header=False)
        core_df.to_excel(writer, sheet_name='CORE', index=False)
        manage_df.to_excel(writer, sheet_name='MANAGE', index=False)

    workbook = openpyxl.load_workbook(output_file_name)

    for sheets in workbook.sheetnames:
        sheet = workbook[sheets]


        # Set the height of all rows to 7
        for row in sheet.iter_rows():
            for cell in row:
                sheet.row_dimensions[cell.row].height = 17

        column_widths = [7, 53, 42, 15, 30]
        # Set the width of each column
        for i, width in enumerate(column_widths):
            column_letter = openpyxl.utils.get_column_letter(i + 1)
            sheet.column_dimensions[column_letter].width = width

        for cell in sheet['E']:
            cell.alignment = openpyxl.styles.Alignment(wrap_text=True)
    # Save the changes
    workbook.save(output_file_name)


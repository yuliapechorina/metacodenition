from google.analytics.data_v1beta import BetaAnalyticsDataClient
from google.analytics.data_v1beta.types import *
from google.oauth2 import service_account
from RunReportUtils import *

def run_test_cases_report(client: BetaAnalyticsDataClient, property_id):
  response: RunReportResponse = run_report(
    client,
    property_id,
    dimensions=[Dimension(name="customEvent:user_upi"), Dimension(name="customEvent:user_testing_group"), Dimension(name="customEvent:question_number")],
    metrics=[Metric(name="customEvent:num_passed"), Metric(name="customEvent:num_test_cases")],
  );
  write_report_to_file(response, "test_cases_report.txt")

def check_test_case_report(client: BetaAnalyticsDataClient, property_id):
  dimension_filters = [
      FilterExpression(
      not_expression=FilterExpression(
        filter=Filter(
          field_name="customEvent:current_test_case",
          string_filter=Filter.StringFilter(value="(not set)"),
        )
      )
    )
  ]
  response: RunReportResponse = run_report(
    client,
    property_id,
    dimensions=[Dimension(name="customEvent:user_upi"), Dimension(name="customEvent:user_testing_group"), 
                Dimension(name="customEvent:question_number"), Dimension(name="customEvent:current_test_case")],
    metrics=[Metric(name="eventCount")],
    dimension_filters=dimension_filters,
  );
  write_report_to_file(response, "check_test_case_report.txt")

def submit_question_3_report (client: BetaAnalyticsDataClient, property_id):
  dimension_filters = [
    FilterExpression(
      filter=Filter(
        field_name="eventName",
        string_filter=Filter.StringFilter(value="confirm_submit_question"),
      )
    )
  ]
  order_bys=[
    OrderBy(
    dimension=OrderBy.DimensionOrderBy(dimension_name="dateHour", order_type=OrderBy.DimensionOrderBy.OrderType.NUMERIC), 
    desc=True
    )
  ]
  response: RunReportResponse = run_report(
    client,
    property_id,
    dimensions=[Dimension(name="customEvent:user_upi"), Dimension(name="customEvent:question_number"), Dimension(name="eventName"), Dimension(name="dateHour")],
    metrics=[Metric(name="eventCount")],
    dimension_filters=dimension_filters,
    order_bys=order_bys,
  );
  
  print(f"Writing to submit_question_3_report.txt");
  with open("submit_question_3_report.txt", "w") as f:
    upi_dimension_header_name = response.dimension_headers[0].name.replace("customEvent:", "")
    f.write(f"{upi_dimension_header_name}\t")
    date_hour_dimension_header_name = response.dimension_headers[3].name
    f.write(f"{date_hour_dimension_header_name}\t")
    f.write("\n")

    for row in response.rows:
      upi_dimension_value = row.dimension_values[0].value
      f.write(f"{upi_dimension_value}\t")
      date_hour_dimension_value = row.dimension_values[3].value
      f.write(f"{date_hour_dimension_value}\t")
      f.write("\n")
  print("Added to submit_question_3_report.txt");

def select_interventions_report (client: BetaAnalyticsDataClient, property_id):
  dimension_filters = [
    FilterExpression(
      filter=Filter(
            field_name="eventName",
            string_filter=Filter.StringFilter(value="select_interventions"),
        )
    ),
    FilterExpression(
      filter=Filter(
            field_name="customEvent:question_number",
            string_filter=Filter.StringFilter(value="3"),
        )
    ),
  ]
  response: RunReportResponse = run_report(
    client,
    property_id,
    dimensions=[Dimension(name="customEvent:user_upi"), Dimension(name="customEvent:user_testing_group"), Dimension(name="eventName"), 
                Dimension(name="customEvent:understanding_the_problem"), Dimension(name="customEvent:designing_a_solution"), 
                Dimension(name="customEvent:evaluating_a_solution"), Dimension(name="customEvent:evaluating_implemented_solution"),
                ],
    metrics=[Metric(name="eventCount")],
    dimension_filters=dimension_filters,
  );
  write_report_to_file(response, "select_interventions_report.txt")

def main():
  credentials = service_account.Credentials.from_service_account_file(".\pedagogic-ide-a137fcb189d5.json")
  client = BetaAnalyticsDataClient(credentials=credentials)
  # run_test_cases_report(client, "313384509")
  # check_test_case_report(client, "313384509")
  submit_question_3_report(client, "313384509")
  # select_interventions_report(client, "313384509")
if __name__ == '__main__':
  main()
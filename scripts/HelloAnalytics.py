from google.analytics.data_v1beta import BetaAnalyticsDataClient
from google.analytics.data_v1beta.types import *
from google.oauth2 import service_account


def sample_run_report(client, property_id):
    request = RunReportRequest(
        property=f"properties/{property_id}",
        dimensions=[Dimension(name="customUser:user_group")],
        metrics=[Metric(name="activeUsers")],
        date_ranges=[DateRange(start_date="2022-09-18", end_date="today")],
    )
    response = client.run_report(request)

    print("Report result:")
    for dimension_header in response.dimension_headers:
      print(dimension_header.name, end="\t")
  
    for metric_header in response.metric_headers:
      print(metric_header.name, end="\n")
    
    for row in response.rows:
      rowString = ''
      for dimension in row.dimension_values:
        rowString += f"{dimension.value}\t\t"
      for metric in row.metric_values:
        rowString += f"{metric.value}\t\t"
      print(rowString)

def sample_run_relatime_report(client: BetaAnalyticsDataClient, property_id):
  request = RunRealtimeReportRequest(
    property=f"properties/{property_id}",
    dimensions=[Dimension(name="customUser:user_group")],
    metrics=[Metric(name="activeUsers")],
  )
  response: RunRealtimeReportResponse = client.run_realtime_report(request)

  print("Realtime report result:")
  for dimension_header in response.dimension_headers:
    print(dimension_header.name, end="\t")
  
  for metric_header in response.metric_headers:
    print(metric_header.name, end="\t\n")
  
  for row in response.rows:
    rowString = ''
    for dimension in row.dimension_values:
      rowString += f"{dimension.value}\t"
    for metric in row.metric_values:
      rowString += f"{metric.value}\t"
    print(rowString)

def run_test_cases_report(client: BetaAnalyticsDataClient, property_id):
  request = RunReportRequest(
    property=f"properties/{property_id}",
    dimensions=[Dimension(name="customEvent:user_upi"), Dimension(name="customEvent:user_testing_group"), Dimension(name="customEvent:question_number")],
    metrics=[Metric(name="customEvent:num_passed"), Metric(name="customEvent:num_test_cases")],
    date_ranges=[DateRange(start_date="2022-09-18", end_date="today")],
    dimension_filter=FilterExpression(
            and_group=FilterExpressionList(
                expressions=[
                    FilterExpression(
                      not_expression=FilterExpression(
                        filter=Filter(
                            field_name="customEvent:user_upi",
                            string_filter=Filter.StringFilter(value="(not set)"),
                        )
                      )
                    ),
                    FilterExpression(
                        not_expression=FilterExpression(
                        filter=Filter(
                            field_name="customEvent:user_upi",
                            string_filter=Filter.StringFilter(value="ypec413"),
                        )
                      )
                    ),
                    FilterExpression(
                        not_expression=FilterExpression(
                        filter=Filter(
                            field_name="customEvent:user_upi",
                            string_filter=Filter.StringFilter(value="kand198"),
                        )
                      )
                    ),
                ]
            )
        ),
  )
  response: RunResponse = client.run_report(request)
  
  print("Writing run_test_cases events to file");
  # Print to file
  with open("test_cases_report.txt", "w") as f:
    for dimension_header in response.dimension_headers:
      f.write(f"{dimension_header.name}\t")
    for metric_header in response.metric_headers:
      f.write(f"{metric_header.name}\t")
    f.write("\n")

    # Sort rows by dimension customEvent:user_upi
    sorted_rows = sorted(response.rows, key=lambda row: row.dimension_values[0].value)
    for row in sorted_rows:
      for dimension in row.dimension_values:
        f.write(f"{dimension.value}\t")
      for metric in row.metric_values:
        f.write(f"{metric.value}\t")
      f.write("\n")

  print("Added run_test_cases events to file")

def main():
  credentials = service_account.Credentials.from_service_account_file(".\pedagogic-ide-a137fcb189d5.json")
  client = BetaAnalyticsDataClient(credentials=credentials)
  # sample_run_report(client, "313384509")
  # sample_run_relatime_report(client, "313384509")
  run_test_cases_report(client, "313384509")
if __name__ == '__main__':
  main()
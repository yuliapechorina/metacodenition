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

def main():
  credentials = service_account.Credentials.from_service_account_file(".\pedagogic-ide-a137fcb189d5.json")
  client = BetaAnalyticsDataClient(credentials=credentials)
  # sample_run_report(client, "313384509")
  sample_run_relatime_report(client, "313384509")
if __name__ == '__main__':
  main()
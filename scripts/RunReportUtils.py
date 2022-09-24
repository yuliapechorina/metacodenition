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

def sample_run_realtime_report(client: BetaAnalyticsDataClient, property_id):
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


def write_report_to_file(response: RunReportResponse, filename: str):
  print(f"Writing to {filename}");

  with open(filename, "w") as f:
    for dimension_header in response.dimension_headers:
      dimension_header.name = dimension_header.name.replace("customEvent:", "")
      f.write(f"{dimension_header.name}\t")
    for metric_header in response.metric_headers:
      metric_header.name = metric_header.name.replace("customEvent:", "")
      f.write(f"{metric_header.name}\t")
    f.write("\n")

    for row in response.rows:
      for dimension in row.dimension_values:
        f.write(f"{dimension.value}\t")
      for metric in row.metric_values:
        f.write(f"{metric.value}\t")
      f.write("\n")

  print(f"Added to {filename}");

def run_report(client: BetaAnalyticsDataClient, property_id: str, dimensions: list[Dimension], metrics: list[Metric], dimension_filters: list[FilterExpression]=None, metric_filter: FilterExpression = None, order_bys: list[OrderBy]=None):
  filter_expressions = [
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
  
  if(dimension_filters):
    filter_expressions.extend(dimension_filters)

  default_order_bys=[
    OrderBy(
    dimension=OrderBy.DimensionOrderBy(dimension_name="customEvent:user_upi", order_type=OrderBy.DimensionOrderBy.OrderType.ALPHANUMERIC), 
    desc=False
    )
  ]

  if(order_bys is None):
    order_bys = default_order_bys

  
  request = RunReportRequest(
    property=f"properties/{property_id}",
    dimensions=dimensions,
    metrics=metrics,
    date_ranges=[DateRange(start_date="2022-09-18", end_date="today")],
    dimension_filter=FilterExpression(
            and_group=FilterExpressionList(
                expressions=filter_expressions
            )
        ),
    metric_filter=metric_filter,
    order_bys=order_bys
  )
  return client.run_report(request)

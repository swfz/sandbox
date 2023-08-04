require "functions_framework"
require "active_support/all"
require "sinatra/base"
require "json"
require "awesome_print"

class Router < Sinatra::Base

  before do
    if params['zone'].present?
      Time.zone = params['zone']
    end
  end

  get('/') do
    content_type :json
    {path: 'slash'}.to_json
  end

  get('/yesterday') do
    content_type :json
    {
      date: {
        from: Time.current.yesterday.strftime('%Y-%m-%d'),
        to: Time.current.yesterday.strftime('%Y-%m-%d'),
      },
      ymd: {
        from: Time.current.yesterday.strftime('%Y%m%d'),
        to: Time.current.yesterday.strftime('%Y%m%d'),
      },
      time: {
        from: Time.current.yesterday.strftime('%Y-%m-%dT00:00:00'),
        to: Time.current.yesterday.strftime('%Y-%m-%dT23:59:59')
      }
    }.to_json
  end

  get('/last_week') do
    content_type :json
    {
      recent: {
        date: {
          from: 1.week.ago.strftime('%Y-%m-%d'),
          to: Time.current.yesterday.strftime('%Y-%m-%d')
        },
        time: {
          from: 1.week.ago.strftime('%Y-%m-%dT00:00:00'),
          to: Time.current.yesterday.strftime('%Y-%m-%dT23:59:59')
        }
      }
    }.to_json
  end

  get('/this_month') do
    content_type :json
    {
      last_month_in_first_day: {
        date: {
          from: Time.current.ago(1.day).beginning_of_month.strftime('%Y-%m-%d'),
          to: Time.current.ago(1.day).end_of_month.strftime('%Y-%m-%d')
        },
        time: {
          from: Time.current.beginning_of_month.strftime('%Y-%m-%d 00:00:00'),
          to: Time.current.end_of_month.strftime('%Y-%m-%d 23:59:59')
        }
      },
      this_month_in_first_day: {
        date: {
          from: Time.current.beginning_of_month.strftime('%Y-%m-%d'),
          to: Time.current.end_of_month.strftime('%Y-%m-%d')
        },
        time: {
          from: Time.current.beginning_of_month.strftime('%Y-%m-%d 00:00:00'),
          to: Time.current.end_of_month.strftime('%Y-%m-%d 23:59:59')
        }
      }
    }.to_json
  end


  not_found do
    "Not Found."
  end
end

FunctionsFramework.http("datetime") do |request|
  Router.call(request.env)
end

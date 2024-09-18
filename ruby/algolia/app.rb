require 'algolia'
require 'awesome_print'

def simple_save
  client = Algolia::SearchClient.create(ENV['ALGOLIA_APP_ID'], ENV['ALGOLIA_ADMIN_API_KEY'])
  record = [{ objectID: "object-1", name: "test record" }]
  index = 'sandbox'

  client.save_objects(
    index,
    record
  )
end

def replace_all
  client = Algolia::SearchClient.create(ENV['ALGOLIA_APP_ID'], ENV['ALGOLIA_ADMIN_API_KEY'])
  record = [{ objectID: "object-2", name: "test record2" }]
  index = 'sandbox'

  client.replace_all_objects(
    index,
    record,
    1000,
  )
end

def update_settings
  client = Algolia::SearchClient.create(ENV['ALGOLIA_APP_ID'], ENV['ALGOLIA_ADMIN_API_KEY'])
  record = [{ objectID: "object-1", name: "test record!!" }, { objectID: "object-2", name: "test record2!!" }]
  index = 'sandbox'

  client.set_settings(
    index,
    Algolia::Search::IndexSettings.build_from_hash(
      {
        attributesToSnippet: ['text:50'],
        attributesForFaceting: ['tags'],
        attributeForDistinct: 'section',
        distinct: true,
      }
    )
  )
end


def main
  # simple_save
  # update_settings
  replace_all
end

main

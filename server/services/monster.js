// https://developer.monster.io/

// access_token: used to authorize request, valid for 1 hour
// must send a POST request to https://api.monster.io/oauth/v1/token

// Sample request using the Basic Authorization
`curl --request POST "https://api.monster.io/oauth/v1/token" 
-u <API_KEY>:<API_SECRET> 
--header 'content-type: application/x-www-form-urlencoded' 
--data-urlencode 'grant_type=client_credentials' 
--data-urlencode 'scope=A'

Sample request using the form params
curl --request POST 'https://api.monster.io/oauth/v1/token' 
--header 'content-type: application/x-www-form-urlencoded' 
--data-urlencode 'client_id=<API_KEY>' 
--data-urlencode 'client_secret=<API_SECRET>' 
--data-urlencode 'grant_type=client_credentials' 
--data-urlencode 'scope=A' 

Sample response
{
  "refresh_token_expires_in" : "0",
  "api_product_list" : "[CandidateLead]",
  "api_product_list_json" : [ "CandidateLead" ],
  "organization_name" : "acme",
  "developer.email" : "john.doe@acme.com",
  "token_type" : "Bearer",
  "issued_at" : "1619520760831",
  "client_id" : "<client_id>",
  "access_token" : "<access_token>",
  "application_name" : "adcc4954-da34-48c6-b862-85e1ce9d18da",
  "scope" : "A",
  "expires_in" : "3599",
  "refresh_count" : "0",
  "status" : "approved"
}`;

const API_KEY = 'HbcL0tLLHOi7eBa2uFJcFTImLFZ7sM9N';
const API_SECRET = 'MfWoeziF6jb7stHw';

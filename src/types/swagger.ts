export type SwaggerRequest = {};

export type SwaggerResponse = {
  statusCode: number;
  message: string;
  data: {
    "openapi": "3.0.0",
    "info": {
      "title": "My API",
      "description": "API description",
      "version": "1.0.0"
    },
    "paths": {
      "/users": {
        "get": {
          "summary": "Get users",
          "responses": {
            "200": {
              "description": "Successful response"
            }
          }
        }
      }
    },
    "components": {
      "schemas": {
        "User": {
          "type": "object",
          "properties": {
            "id": { "type": "integer" },
            "name": { "type": "string" }
          }
        }
      }
    }
  }
};

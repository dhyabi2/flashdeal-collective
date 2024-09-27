# Additional API Endpoints for Flash Deals Application

## Get Deal by ID

This endpoint retrieves a specific deal by its ID.

- **URL**: `/api/deals/:id`
- **Method**: `GET`
- **URL Parameters**: 
  - `id`: The ID of the deal to retrieve

### Success Response

- **Code**: 200 OK
- **Content**: A JSON object representing the deal

```json
{
  "id": "123456",
  "title": "50% off on Electronics",
  "imageBase64": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD...",
  "category": "Electronics",
  "expiresAt": "2023-05-01T12:00:00Z",
  "location": "New York",
  "addedBy": "John Doe",
  "likes": 10,
  "dislikes": 2,
  "createdAt": "2023-04-28T10:00:00Z"
}
```

### Error Responses

- **Code**: 404 Not Found
  - **Content**: `{ "error": "Deal not found" }`

- **Code**: 500 Internal Server Error
  - **Content**: `{ "error": "Internal server error" }`

### Notes

- This endpoint should be used to fetch the details of a shared deal when a user opens a shared link.
- The frontend should use this endpoint in the SharedDealPage component to display the deal details.
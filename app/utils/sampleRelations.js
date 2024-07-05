export const sampleRelationships = [
    {
        "source": "users",
        "target": "messages",
        "sourceField": "ObjectId",
        "targetField": "sender",
        "relationType": "oneToMany",
        "confidence": "high"
    },
    {
        "source": "users",
        "target": "messages",
        "sourceField": "ObjectId",
        "targetField": "receiver",
        "relationType": "oneToMany",
        "confidence": "high"
    },
    {
        "source": "users",
        "target": "comments",
        "sourceField": "ObjectId",
        "targetField": "author",
        "relationType": "oneToMany",
        "confidence": "high"
    },
    {
        "source": "users",
        "target": "addresses",
        "sourceField": "ObjectId",
        "targetField": "user",
        "relationType": "oneToOne",
        "confidence": "high"
    },
    {
        "source": "users",
        "target": "likes",
        "sourceField": "ObjectId",
        "targetField": "user",
        "relationType": "oneToMany",
        "confidence": "high"
    },
    {
        "source": "users",
        "target": "notifications",
        "sourceField": "ObjectId",
        "targetField": "user",
        "relationType": "oneToMany",
        "confidence": "high"
    },
    {
        "source": "users",
        "target": "profiles",
        "sourceField": "ObjectId",
        "targetField": "user",
        "relationType": "oneToOne",
        "confidence": "high"
    },
    {
        "source": "users",
        "target": "reviews",
        "sourceField": "ObjectId",
        "targetField": "user",
        "relationType": "oneToMany",
        "confidence": "high"
    },
    {
        "source": "users",
        "target": "subscriptions",
        "sourceField": "ObjectId",
        "targetField": "user",
        "relationType": "oneToMany",
        "confidence": "high"
    },
    {
        "source": "users",
        "target": "orders",
        "sourceField": "ObjectId",
        "targetField": "user",
        "relationType": "oneToMany",
        "confidence": "high"
    },
    {
        "source": "users",
        "target": "payments",
        "sourceField": "ObjectId",
        "targetField": "user",
        "relationType": "oneToMany",
        "confidence": "high"
    },
    {
        "source": "users",
        "target": "follows",
        "sourceField": "ObjectId",
        "targetField": "follower",
        "relationType": "oneToMany",
        "confidence": "high"
    },
    {
        "source": "users",
        "target": "follows",
        "sourceField": "ObjectId",
        "targetField": "following",
        "relationType": "oneToMany",
        "confidence": "high"
    },
    {
        "source": "posts",
        "target": "comments",
        "sourceField": "ObjectId",
        "targetField": "post",
        "relationType": "oneToMany",
        "confidence": "high"
    },
    {
        "source": "posts",
        "target": "likes",
        "sourceField": "ObjectId",
        "targetField": "post",
        "relationType": "oneToMany",
        "confidence": "high"
    },
    {
        "source": "products",
        "target": "reviews",
        "sourceField": "ObjectId",
        "targetField": "product",
        "relationType": "oneToMany",
        "confidence": "high"
    },
    {
        "source": "products",
        "target": "orders",
        "sourceField": "ObjectId",
        "targetField": "products",
        "relationType": "oneToMany",
        "confidence": "high"
    },
    {
        "source": "orders",
        "target": "payments",
        "sourceField": "ObjectId",
        "targetField": "order",
        "relationType": "oneToOne",
        "confidence": "high"
    },
    {
        "source": "chats",
        "target": "messages",
        "sourceField": "messages",
        "targetField": "ObjectId",
        "relationType": "oneToMany",
        "confidence": "high"
    },
    {
        "source": "users",
        "target": "posts",
        "sourceField": "posts",
        "targetField": "ObjectId",
        "relationType": "oneToMany",
        "confidence": "high"
    },
    {
        "source": "tags",
        "target": "posts",
        "sourceField": "posts",
        "targetField": "ObjectId",
        "relationType": "oneToMany",
        "confidence": "high"
    },
    {
        "source": "categories",
        "target": "posts",
        "sourceField": "posts",
        "targetField": "ObjectId",
        "relationType": "oneToMany",
        "confidence": "high"
    },
    {
        "source": "groups",
        "target": "posts",
        "sourceField": "posts",
        "targetField": "ObjectId",
        "relationType": "oneToMany",
        "confidence": "high"
    }
]
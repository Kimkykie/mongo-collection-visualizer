# MongoSchemaViz

MongoSchemaViz is an innovative tool designed to visualize MongoDB schemas and analyze their relationships. It provides a clear, interactive representation of your database structure, enhancing understanding and facilitating better database design decisions.

## 🌟 Features

- **Schema Visualization**: Automatically generate visual representations of your MongoDB schemas.
- **Relationship Analysis**: Infer and visualize relationships between collections, with optional AI-powered insights.
- **Collection and Field Filtering**: Easily navigate through your data structure.
- **Interactive UI**: User-friendly interface for exploring your MongoDB architecture.

## 🧠 Why MongoSchemaViz?

MongoDB's flexible schema design is powerful but can lead to challenges in understanding the overall data structure, especially in large, complex applications. MongoSchemaViz addresses this by:

1. Automatically analyzing and visualizing your MongoDB collections.
2. Inferring relationships between collections, even without explicit references.
3. Providing a clear, visual representation of your data structure.

This tool is invaluable for teams working on large-scale MongoDB projects, during codebase onboarding, or when planning data structure changes.

## 🚀 Getting Started

### Prerequisites

- Node.js (version 14 or later)
- A MongoDB instance (local or remote)
- OpenAI API key (optional, for enhanced relationship analysis)

### Installation

1. Clone the repository:
```code
https://github.com/Kimkykie/mongo-collection-visualizer.git
```

2. Navigate to the project directory:
```code
cd MongoSchemaViz
```

3. Install dependencies:
```

npm install
```

4. Create a `.env.local` file in the root directory and add your MongoDB URI and OpenAI API key (if using):
```code
MONGODB_URI=your_mongodb_uri_here
OPENAI_API_KEY=your_api_key_here
```

5. Run the development server:

```code
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🛠️ Built With

- [Next.js 14](https://nextjs.org/)
- [React](https://reactjs.org/)
- [MongoDB](https://www.mongodb.com/)
- [Mongoose](https://mongoosejs.com/)
- [OpenAI API](https://openai.com/) (optional)
- [Framer Motion](https://www.framer.com/motion/)
- [React Flow](https://reactflow.dev/)
- [Zustand](https://github.com/pmndrs/zustand)
- [Tailwind CSS](https://tailwindcss.com/)
- [Headless UI](https://headlessui.dev/)
- [Hero Icons](https://heroicons.com/)

## 📘 Usage

1. Connect to your MongoDB instance using the connection string.
2. MongoSchemaViz will automatically analyze your schemas and visualize the collections.
3. Explore your data structure using the interactive visualization.
4. Use the "Fetch Relationships" feature for additional insights (AI-powered if configured).
5. Use filters to focus on specific collections or fields.

## 🗺️ Roadmap

- [ ] Implement filtering functionality for collections and fields
- [ ] Add dark mode support
- [ ] Develop a manual mode for relationship definition
- [ ] Introduce data sampling for large collections
- [ ] Add export functionality for visualizations

## 📄 License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## 🙏 Acknowledgments

- The MongoDB and Mongoose communities for inspiring this project
- OpenAI for providing AI capabilities for enhanced  analysis

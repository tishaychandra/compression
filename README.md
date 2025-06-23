# Data Compression & Decompression Web Application

A modern web application that allows users to upload files and apply various data compression algorithms to reduce file size, as well as decompress previously compressed files. The system demonstrates the efficiency of different algorithms by providing compression ratios and allows users to download the processed files.

## 🚀 Live Demo

**[View Live Application](https://beamish-selkie-049147.netlify.app/)**

## Features

- **File Upload**: Upload any file (text, image, binary) for compression
- **Multiple Compression Algorithms**: Support for Huffman Coding, Run-Length Encoding (RLE), and LZ77
- **Compression & Decompression**: Compress or decompress files using chosen algorithms
- **Compression Statistics**: Real-time display of compression ratio, original size, compressed size, and processing time
- **Download Processed Files**: Download compressed or decompressed files
- **Algorithm Documentation**: Detailed explanations and analysis of each compression algorithm
- **Error Handling**: Proper feedback for unsupported files or decompression errors
- **Responsive UI**: Intuitive frontend with modern design and real-time status updates
- **Visualization**: Charts and statistics using Chart.js
- **Cross-Platform**: Works on desktop and mobile devices

## Tech Stack

### Frontend
- **Framework**: React.js 18+ with Vite
- **Styling**: Tailwind CSS 3.4+ with PostCSS
- **File Handling**: JavaScript FileReader API
- **Visualization**: Chart.js with React Chart.js 2
- **Routing**: React Router DOM 6+
- **Notifications**: React Hot Toast
- **Icons**: Lucide React

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js 4+
- **File Handling**: Multer for file uploads
- **Compression Algorithms**: Custom JavaScript implementations
- **Database**: MongoDB with Mongoose ODM
- **Security**: Helmet.js, CORS, Rate Limiting
- **Compression**: Express compression middleware

### Development Tools
- **Package Manager**: npm 9+
- **Environment**: Separate .env files for client and server
- **Build Tool**: Vite for fast development and optimized builds

## 🛠️ Setup Instructions

### Prerequisites
- **Node.js** (v18 or higher)
- **npm** (v9 or higher)
- **MongoDB** (local or cloud instance - MongoDB Atlas recommended)

### Quick Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/tishaychandra/compression
   cd data-compression-decompression
   ```

2. **Install dependencies**
   ```bash
   # Install server dependencies
   cd server
   npm install
   
   # Install client dependencies
   cd ../client
   npm install
   ```

3. **Environment Setup**
   
   Create `.env` file in the server directory:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/compression-app
   NODE_ENV=development
   MAX_FILE_SIZE=10485760
   ```
   
   Create `.env` file in the client directory:
   ```env
   VITE_API_URL=http://localhost:5000
   ```

4. **Start MongoDB** (if using local instance)
   ```bash
   # Start MongoDB service
   mongod
   ```

5. **Start the application**
   ```bash
   # Terminal 1: Start the server (from server directory)
   cd server
   npm run dev
   
   # Terminal 2: Start the client (from client directory)
   cd client
   npm run dev
   ```

6. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000
   - Health Check: http://localhost:5000/api/health

### MongoDB Setup

**Option 1: MongoDB Atlas (Cloud - Recommended)**
1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Get your connection string
4. Replace `MONGODB_URI` in server `.env` file

**Option 2: Local MongoDB**
1. Install MongoDB Community Edition
2. Start MongoDB service
3. Use connection string: `mongodb://localhost:27017/compression-app`

## 📖 Usage Guide

1. **Upload a File**: 
   - Drag and drop any file onto the upload area
   - Or click to browse and select a file
   - Supported: Any file type up to 10MB

2. **Compress Files**:
   - Click "Compress" to run all algorithms
   - Or use individual algorithm compression
   - View real-time compression statistics

3. **Download Results**:
   - Download compressed files
   - Decompress files back to original format
   - Download decompressed files

4. **Learn Algorithms**:
   - Navigate to "Algorithms" page
   - Read detailed explanations
   - Understand advantages and disadvantages

## 🔌 API Endpoints

### File Management
- `POST /api/upload` - Upload a file
- `GET /api/files` - Get all files
- `GET /api/files/:id` - Get specific file
- `DELETE /api/files/:id` - Delete a file

### Compression
- `POST /api/compress/:fileId/:algorithm` - Compress with specific algorithm
- `POST /api/compress/:fileId/all` - Compress with all algorithms
- `GET /api/files/download/:filename` - Download a file

### Health Check
- `GET /api/health` - Server health status

## 🧮 Compression Algorithms

### Huffman Coding
- **Type**: Lossless compression
- **Principle**: Variable-length encoding based on character frequency
- **Best For**: Text files with repeated characters
- **Time Complexity**: O(n log n)
- **Advantages**: Optimal compression for text, widely used
- **Disadvantages**: Requires frequency analysis, overhead for small files

### Run-Length Encoding (RLE)
- **Type**: Lossless compression
- **Principle**: Replaces repeated characters with count and character
- **Best For**: Files with many repeated sequences
- **Time Complexity**: O(n)
- **Advantages**: Simple, fast, no additional data structures
- **Disadvantages**: Poor for diverse data, can increase size for random data

### LZ77
- **Type**: Lossless compression
- **Principle**: Dictionary-based compression using sliding window
- **Best For**: General-purpose compression
- **Time Complexity**: O(n²)
- **Advantages**: Good for various data types, adaptive
- **Disadvantages**: Higher complexity, memory requirements

## 🚀 Deployment

### Frontend Deployment (Netlify)
1. Build the project: `npm run build`
2. Deploy the `dist` folder to Netlify
3. Set environment variables in Netlify dashboard

### Backend Deployment (Render)
1. Connect your GitHub repository to Render
2. Set environment variables:
   - `MONGODB_URI`
   - `NODE_ENV=production`
   - `PORT=10000`
3. Deploy as a web service

## 🧪 Testing

Test the application with different file types:
- **Text files**: `.txt`, `.md`, `.json`
- **Images**: `.jpg`, `.png`, `.gif`
- **Documents**: `.pdf`, `.docx`
- **Archives**: `.zip`, `.rar`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.
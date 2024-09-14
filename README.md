# E-Commerce Web Application

## Overview

This is a full-stack e-commerce web application built with Node.js, Express, MongoDB, and integrates with Cloudinary for image management. The application allows users to view products, add them to their cart, and manage their profiles.

## Deployement Link
https://e-commerce-k6o6.onrender.com/products/66e586444b80665c76b1fcfd

## Features

- **Product Management**: Add, view, edit, and delete products.
- **User Authentication**: Register, log in, and manage user profiles.
- **Cart Functionality**: Add products to the cart and view the cart.
- **Image Management**: Upload and manage product images using Cloudinary.
- **Responsive Design**: Built with Bootstrap for a responsive and modern user interface.

## Technologies Used

- **Backend**: Node.js, Express
- **Database**: MongoDB
- **Authentication**: Passport.js
- **Image Hosting**: Cloudinary
- **Frontend**: EJS, Bootstrap
- **Version Control**: Git, GitHub

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v14 or later)
- [MongoDB](https://www.mongodb.com/try/download/community) (installed locally or a MongoDB Atlas account)
- [Cloudinary](https://cloudinary.com/) account (for image management)

### Installation

1. **Clone the Repository**

    ```bash
    git clone https://github.com/your-username/your-repository-name.git
    cd your-repository-name
    ```

2. **Install Dependencies**

    ```bash
    npm install
    ```

3. **Set Up Environment Variables**

    Create a `.env` file in the root directory and add the following variables:

    ```env
    MONGODB_URI=your-mongodb-uri
    CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
    CLOUDINARY_API_KEY=your-cloudinary-api-key
    CLOUDINARY_API_SECRET=your-cloudinary-api-secret
    SESSION_SECRET=your-session-secret
    ```

4. **Run Migrations (if any)**

    Follow the instructions in the documentation for running any migrations or seed scripts if applicable.

5. **Start the Application**

    ```bash
    npm start
    ```

    The application will be available at `http://localhost:3000`.

## Deployment

1. **Choose a Deployment Platform**: Render, Heroku, AWS, Vercel, etc.
2. **Connect Your GitHub Repository**: Link your repository to the chosen platform.
3. **Configure Build Settings**: Set up build and deployment configurations as required.
4. **Deploy**: Follow the platform’s instructions to deploy the application.

## Usage

- **Homepage**: View the latest products and navigate to different sections.
- **Products**: Browse products, view details, and manage them if logged in.
- **Cart**: Add products to your cart and view them.
- **Profile**: Manage your user profile and view your products.

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgements

- [Bootstrap](https://getbootstrap.com/)
- [Cloudinary](https://cloudinary.com/)
- [MongoDB](https://www.mongodb.com/)
- [Express](https://expressjs.com/)
- [Node.js](https://nodejs.org/)

## Contact

For any questions or issues, please contact [your-email@example.com](mailto:mohits9168@gmail.com).

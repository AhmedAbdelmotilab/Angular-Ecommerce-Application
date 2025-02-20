The [Angular-Ecommerce-Application](https://github.com/AhmedAbdelmotilab/Angular-Ecommerce-Application) is a comprehensive Angular-based e-commerce platform designed to provide users with a seamless online shopping experience. Below is an in-depth overview of the project's features, technologies, setup instructions, and more.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Screenshots](#screenshots)
- [Deployment](#deployment)
- [Contributing](#contributing)

## Features

- **User Authentication:** Secure user registration and login functionalities to protect user data and ensure personalized experiences.
- **Product Browsing:** Explore a wide range of products with detailed information, including images, descriptions, and prices.
- **Shopping Cart:** Add products to the cart, manage quantities, and proceed to checkout with ease.
- **Order Management:** Track orders, view order history, and receive updates on order statuses.
- **Responsive Design:** Optimized for various devices, ensuring a consistent user experience across desktops, tablets, and mobile phones.
- **Light and Dark Mode:** Supports both light and dark themes for a customizable user experience.

## Technologies Used

- **Frontend Framework:** Angular
- **Styling:** SCSS (Sassy CSS) and Tailwind CSS
- **UI Enhancements:** Flowbite, SweetAlert2, ngx-toastr
- **Build and Configuration Tools:**
  - Angular CLI
  - Tailwind CSS Configuration

## Project Structure

The project follows a standard Angular structure with the following key components:

- **`src/app`**: Contains the main application modules and components.
- **`src/assets`**: Houses static assets like images and icons.
- **`src/environments`**: Includes environment-specific configurations.
- **`angular.json`**: Angular CLI configuration file.
- **`package.json`**: Lists project dependencies and scripts.
- **`tailwind.config.js`**: Configuration file for Tailwind CSS.

## Getting Started

To set up the project locally, follow these steps:

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/AhmedAbdelmotilab/Angular-Ecommerce-Application.git
   ```
2. **Navigate to the Project Directory:**
   ```bash
   cd Angular-Ecommerce-Application
   ```
3. **Install Dependencies:**
   Ensure you have Node.js and npm installed. Then, install the project dependencies:
   ```bash
   npm install
   ```
4. **Run the Application:**
   Start the development server:
   ```bash
   ng serve
   ```
   By default, the application will run on `http://localhost:4200/`.

## Screenshots
![Login-Light](https://github.com/user-attachments/assets/e4612ed8-4ea8-4490-8de5-762304594e5b)
![Login-Dark](https://github.com/user-attachments/assets/38053f21-04bf-4348-bcab-f4560287184a)
![Register-Light](https://github.com/user-attachments/assets/c7bbbdca-4a9f-4ae2-95b8-51f55f7ca2ac)
![Register-Dark](https://github.com/user-attachments/assets/658ee016-cf4f-4bd9-bd30-3e6b003201a0)
![Home](https://github.com/user-attachments/assets/186b13ba-0806-4628-b07d-e3851ad6dcb5)
![Products](https://github.com/user-attachments/assets/80f449c6-abac-4abf-b14a-8847ab332e14)
![Product-Details](https://github.com/user-attachments/assets/e96593eb-43ad-4601-a7a1-fbb0e13cbad4)
![Cart](https://github.com/user-attachments/assets/cb0c119c-9085-4306-8cea-554f458dd0ab)
![CheckOut](https://github.com/user-attachments/assets/bf8c9f44-ad6e-4059-875a-7ab24cce626a)
![Orders](https://github.com/user-attachments/assets/229cf048-c56e-4bf9-8358-dbf3d9cdcded)


## Deployment

The application is deployed and accessible at [https://angular-ecommerce-application.vercel.app](https://angular-ecommerce-application.vercel.app). Deployment is managed through Vercel, offering features like automatic HTTPS and global CDN for optimal performance.

## Contributing

Contributions are welcome! To contribute:

1. Fork the repository.
2. Create a new branch: `git checkout -b feature/YourFeatureName`.
3. Make your changes and commit them: `git commit -m 'Add some feature'`.
4. Push to the branch: `git push origin feature/YourFeatureName`.
5. Open a pull request.


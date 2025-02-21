# Next.js COCO

Brief description of the COCO project.

## Prerequisites

Before you begin, ensure you have met the following requirements:
- [Node.js](https://nodejs.org/en/) (version X or above)
- npm (usually comes with Node.js) or [Yarn](https://yarnpkg.com/)
- Git installed on your machine

## Installation

Follow these steps to set up your development environment:

1. **Clone the repository**

    ```bash
    git clone https://github.com/yourusername/your-nextjs-project.git
    cd your-nextjs-project
    ```

2. **Add .env.local file**

    Create a `.env.local` file in the root of the project with the following content. The URL (`http://127.0.0.1:8000`) can be changed based on your Django project URL:

    ```ini
    NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8000
    NEXT_PUBLIC_DOMAIN_NAME=COCO
    NEXT_PUBLIC_COMPANY_NAME="SmartTech LLC"
    ```

3. **Install npm packages**

    ```bash
    npm install
    ```

4. **Run the development server**

    ```bash
    npm run dev
    ```

Your application should now be running on [http://localhost:3000](http://localhost:3000).

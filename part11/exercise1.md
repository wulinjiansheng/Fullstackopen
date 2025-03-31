- Some common steps in a CI setup include linting, testing, and building. What are the specific tools for taking care of these steps in the ecosystem of the language you picked? You can search for the answers by Google.

Using JavaScript for React-based web development:
	- Linting: Use ESLint for code quality checks and Prettier for automatic code formatting.
	- Testing:
		1. Jest for unit testing,
		2. React Testing Library for component-level UI testing,
		3.	Playwright for end-to-end (E2E) testing.
	- Building: Use Webpack or Vite for transpiling modern JavaScript and bundling the application.

- What alternatives are there to set up the CI besides Jenkins and GitHub Actions?

CircleCI

- Would this setup be better in a self-hosted or a cloud-based environment? Why? What information would you need to make that decision?

cloud-based environment，no need to worry about infra and DevOps setup, works seamlessly with GitHub. Easy to scale.
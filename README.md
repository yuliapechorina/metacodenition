<h1 align="center">
  <img src="https://user-images.githubusercontent.com/68877945/169925592-729adf32-0e26-4c30-b4fd-5d44652ca751.svg" alt="Musicracy" height="200px"></a>
</h1>
<h4 align="center">Part IV Project: A Pedagogic IDE</h4>
<h6 align="center">Yulia Pechorina and Keith Anderson</h6>
<p align="center">
 <img src="https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript"></a>
 <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React"></a>
 <img src="https://img.shields.io/badge/firebase-%23039BE5.svg?style=for-the-badge&logo=firebase" alt="Firebase"></a>
 <img src="https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white&color=%2337BFFB" alt="TaiwindCSS"></a>
 <img src="https://img.shields.io/badge/ESLint-4B3263?style=for-the-badge&logo=eslint&logoColor=white" alt="ESLint"></a>
 <img src="https://img.shields.io/badge/prettier-1A2C34?style=for-the-badge&logo=prettier&logoColor=F7BA3E" alt="Prettier"></a>
 <img src="https://img.shields.io/badge/testing%20library-323330?style=for-the-badge&logo=testing-library&logoColor=red" alt="ReactTestingLibrary"></a>
</p>
<br>

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Running the project

While you can run the project offline using the firestore emulator suite, this would require extensive changes to the source code.
It is actually much easier to get up-and-running by creating a firestore project on the [Firebase Console](https://console.firebase.google.com/).
This project should not cost anything to run, as you will fall well within the free tier limits.
You can run this project without activating billing.

### Setting up the Firebase project

For the most up-to-date instructions, see the [Firebase documentation](https://firebase.google.com/docs/web/setup).

1. Create a new project on the [Firebase Console](https://console.firebase.google.com/).
2. Enable analytics if prompted, and when prompted to choose locations it is recommended to choose the closest location to you.
3. From the "Project Overview" page, select the `</>` icon to add a web app to your project. Give your app a nickname and check the "Also set up Firebase Hosting for this app" checkbox.
4. Copy the config object from the Firebase SDK snippet.
5. Create a `.env` file in the root of the project.
6. Add the following to the `.env` file, replacing the values with your own:

```
REACT_APP_FIREBASE_API_KEY=your-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-auth-domain
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-storage-bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
REACT_APP_FIREBASE_FIREBASE_APP_ID=your-app-id
```

7. Follow the instructions to install the CLI
8. From the root of the project, run `firebase login` and follow the instructions to login to your Firebase account.
9. Run `firebase init` and select the following options:

```
? Which Firebase CLI features do you want to set up for this folder? Press Space to select features, then Enter to confirm your choices.
 ◯ Database: Deploy Firebase Realtime Database Rules
 ◯ Firestore: Deploy rules and create indexes for Firestore
 ◯ Functions: Configure and deploy Cloud Functions
❯◉ Hosting: Configure and deploy Firebase Hosting sites
  ◯ Storage: Deploy Cloud Storage security rules
```

10. Select "Use an existing project". Select the project you created in step 1.
11. Select "build" as the public directory.
12. Select "Configure as a single-page app (rewrite all urls to /index.html)".
13. Do not select "Set up automatic builds and deploys with GitHub".
14. Do not select "Overwrite build/index.html?".
15. Run `npm run build` to build the project.
16. Run `firebase deploy` to deploy the project.
17. Navigate to firebase console and select the authentication tab.
18. Select "Set up sign-in method" and enable "Google" sign-in method.
19. Navigate to the "Firestore Database" tab and select "Create database". You can start in test mode and change to production later. Remember to select the region closest to you.
20. Add a collection name "assignments", and add a document with Document ID "test". Add the following fields to the document:

```
name | string | Test Assignment
questions | array |
      string | test_q_1
```

21. Add a collection name "questions", and add a document with Document ID "test_q_1". Add the following fields to the document:

```
codeTemplate | string | #include <stdio.h>\n/** STUDENT CODE BEGINS **/\n\n/** STUDENT CODE ENDS **/\nint main()\n{\n\tchar[] name = "Paul Denny\0";\n\tsay_hello(name);\n\treturn 0;\n}\n
function | map
      arguments | array
              map |
                    name | string | name
                    isArray | boolean | true
                    type | string | char
      name | string | say_hello
      returnType | string | void
testCases | array
      map |
            input | array
                    map |
                          value | string | Paul Denny
                          size | number | 11
            expected | string | Hello, Paul Denny
            id | string | default-1
text | string | Write a function that takes a name as a parameter and prints "Hello, <name>" to the console.
```

21. You should now be able to access the project at the URL provided by the Firebase CLI. You can also run the project locally by running `npm start`.

## Accessing the compendium

Data from the trial period is stored in the `compendium` folder.
The `compendium/database` folder contains all database objects from the project's Cloud Firestore database.
The `compendium/analytics` folder contains all analytics events from 22/09/22.

### Python scripts

We used many Python scripts throughout the project to process data.
Some of these scripts may prove useful (especially the analytics scripts).
These can be found in the `scripts` folder.

### BigQuery queries

The best way to access and query the data from the compendium is to use BigQuery.
The `compendium/bigquery` folder contains all the queries we used.
This is especially useful, as the `firestore/assignments` and `firestore/users/USER/assignments` are merged in `compendium/database/questions.json`. The same applies for the `questions` collections.

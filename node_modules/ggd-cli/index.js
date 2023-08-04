#!/usr/bin/env node

import chalk from "chalk";
import inquirer from "inquirer";
import gradient from "gradient-string";
import chalkAnimation from "chalk-animation";
import figlet from "figlet";
import { createSpinner } from "nanospinner";

let userName;

const sleep = (ms = 2000) => new Promise((r) => setTimeout(r, ms));

async function askName() {
    const answer = await inquirer.prompt({
        name: 'user_name',
        type: 'input',
        message: 'What is your name',
        default() {
            return 'User';
        }
    });

    userName = answer.user_name
}

async function welcome() {
    const rainbowTitle = chalkAnimation.glitch(
        `How can i help you, ${userName}?`
    );

    await sleep();
    rainbowTitle.stop();

    console.log(`
        ${chalk.bgRed('I am process in your computer')}
        
    `);

}

async function question1() {
    while (true) {
        const answer = await inquirer.prompt({
            name: 'question_1',
            type: 'list',
            message: 'Here are some examples to help you learn more about Git',
            choices: [
                'What is Git',
                'How can i use it',
                'How can i publish repository in Git',
                'Basic Git commands',
                'Goodbye',
            ],
        });

        if (answer.question_1 === 'Goodbye') {
            console.clear();
            break;
        }

        const response = handleAnswer(answer.question_1);
        console.log(response);
    }
}

function handleAnswer(choice) {
    switch (choice) {
        case 'What is Git':
            return 'Git is a version control system that allows you to track changes in your code.';
        case 'How can i use it':
            return 'You can use Git by installing it on your computer and using commands in the terminal.';
        case 'How can i publish repository in Git':
            return `To publish a repository in Git, you need to follow these steps:
                1. ${chalk.blue('Create a Git Repository')}: If you haven't already done so, you'll need to create a new Git repository or initialize an existing project as a Git repository.
                    Navigate to the root folder of your project in the terminal or command prompt and run the following command:
                    ${chalk.bgGreen('git init')}

                2. Add Files: Add the files and directories that you want to include in the repository. You can add all the files in the current directory by running:
                    ${chalk.bgGreen('git add .')}

                3. Commit Changes: Create a commit with the changes you want to include in the repository. A commit is like a snapshot of the current state of your project:
                    ${chalk.bgGreen('git commit -m "Initial commit"')}

                4. Create a Remote Repository: You need a remote repository to publish your local repository to.

                    # On the remote server
                    ${chalk.bgGreen('mkdir my_project.git')}
                    ${chalk.bgGreen('cd my_project.git')}
                    ${chalk.bgGreen('git init --bare')}

                5. Add Remote: Connect your local repository to the remote repository you just created:

                    If you're using a Git hosting service, you'll likely get a URL for your remote repository.Run the following command in your local repository:
                        ${chalk.bgGreen('git remote add origin <remote_repository_url>')}

                    If you created a remote repository on a server, you'll need the server's address (e.g., user@server_address:/path/to/my_project.git).
                    Run the following command in your local repository:
                        ${chalk.bgGreen('git remote add origin <server_address>')}

                6. Push to the Remote Repository: Now that you've set up the remote, you can push your local repository to it:
                    ${chalk.bgGreen('git push -u origin master')}

                    This command pushes your changes to the ${chalk.bgGreen('master')} branch in the remote repository.
                    The ${chalk.bgGreen('-u')} flag sets up a tracking relationship between your local ${chalk.bgGreen('master')} branch and the remote ${chalk.bgGreen('origin/master')}, making future pushes and pulls more convenient.
            
                `;
        case 'Basic Git commands':
            return `
                1. ${chalk.bgBlue('git config')}
                    Usage: ${chalk.bgBlue(`git config –global user.name “[name]”`)}
                    Usage: ${chalk.bgBlue(`git config –global user.email “[email address]”`)}

                    This command sets the author name and email address respectively to be used with your commits.

                2. ${chalk.bgBlue('git init')}
                    Usage: ${chalk.bgBlue(`git init [repository name]`)}

                    This command is used to start a new repository.

                3. ${chalk.bgBlue('git reset')}
                    Usage: ${chalk.bgBlue(`git init [repository name]`)}

                    This command unstages the file, but it preserves the file contents.

                4. ${chalk.bgBlue('git status')}

                    Usage: ${chalk.bgBlue(`git status`)}

                    This command lists all the files that have to be committed.

                5. ${chalk.bgBlue('git log')}

                    Usage: ${chalk.bgBlue(`git log`)}

                    This command is used to list the version history for the current branch.

            `
        case 'Goodbye':
            return 'Goodbye! Have a great day!';
        default:
            return 'Invalid choice. Please choose one of the available options.';
    }
}

function winner(text) {
    console.clear();
    const msg = `${text}, ${userName} `;

    figlet(msg, (err, data) => {
        console.log(gradient.pastel.multiline(data));
    })
}

console.clear();
await askName();
await welcome();
question1()
    .then(() => {
        winner('Goodbye');
    })
    .catch(error => {
        console.error('Error:', error);
    });
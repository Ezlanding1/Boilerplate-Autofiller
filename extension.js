// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const {readFileSync, promises: fsPromises} = require('fs');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
/**
 * @param {vscode.ExtensionContext} context
 */

// Function to paste Boilerplate 
const BoilerplateFiller = async function(languages){
    if (!languages){
        console.error("Error: Languages not found");
        return;
    }
    
    languages.forEach(value => {
        value.detail = value.detail? value.detail : "Fills In Boilerplate For '" + value.label + "'";
    });
    let result = await vscode.window.showQuickPick(languages, {matchOnDetail:"true"});
    if (!result){
        return;
    }
    if (result["Children"]){
        BoilerplateFiller(result["Children"]);
    }
    else{
        write(result);
    }  
}

function activate(context) {

	console.log("Path: " + context.extensionUri.fsPath);
    var dir = context.extensionUri.fsPath;
    if (!dir){
        console.error("Error: Path not found");
    }
    var langs = JSON.parse(readFileSync(`${dir}\\languages.json`));
    if (!langs){
        console.error("Error: languages.json does not exist or contatins invalid JSON data");
    }
	
	let disposable = vscode.commands.registerCommand('boilerplate-autofiller.fillBoilerplate', function(){
        BoilerplateFiller(langs["Languages"]);
    });
	context.subscriptions.push(disposable);
}

// Write boilerplate text to open file
const write = function (l) {
    const editor = vscode.window.activeTextEditor;
    if (editor) {
        editor.edit(editBuilder => {
            editBuilder.insert(editor.selection.active, l.Boilerplate);
        });
    }
    vscode.window.showInformationMessage('Filled In Boilerplate For: ' + l.label);
}

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
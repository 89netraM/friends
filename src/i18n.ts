type Phrases
	= "acceptFailure"
	| "add"
	| "addFriend"
	| "addNewPerson"
	| "cancel"
	| "done"
	| "failedToLoad"
	| "failedToLoad.description"
	| "failedToSave"
	| "failedToSave.description"
	| "fileName"
	| "fileSelected"
	| "friend"
	| "friends"
	| "load"
	| "loading"
	| "loadNetwork"
	| "network"
	| "networkAlreadyExists"
	| "newPersonName"
	| "noFileSelected"
	| "overwrite"
	| "overwriteNetwork"
	| "save"
	| "saveNetwork"
	| "saving"
	| "selectImage"
	| "selectNetwork"
	| "uploadImage"
	| "wishToOverwrite"
	;

const languages: { [code: string]: Record<Phrases, string> } = {
	"en": {
		"acceptFailure": "Ok",
		"add": "Add",
		"addFriend": "Add a friend",
		"addNewPerson": "Add new person",
		"cancel": "Cancel",
		"done": "Done",
		"failedToLoad": "Failed to load",
		"failedToLoad.description": "Something went wrong and we failed to load your network.",
		"failedToSave": "Failed to save",
		"failedToSave.description": "Something went wrong and we failed to save your network.",
		"fileName": "Name",
		"fileSelected": "File selected",
		"friend": "Friend",
		"friends": "Friends",
		"load": "Load",
		"loading": "Loading...",
		"loadNetwork": "Load Network",
		"network": "Network",
		"networkAlreadyExists": "A network with that name already exists.",
		"newPersonName": "New persons name",
		"noFileSelected": "No file selected",
		"overwrite": "Overwrite",
		"overwriteNetwork": "Overwrite Network",
		"save": "Save",
		"saveNetwork": "Save Network",
		"saving": "Saving...",
		"selectImage": "Select Image",
		"selectNetwork": "Select a network",
		"uploadImage": "Upload Image",
		"wishToOverwrite": "Do you wish to overwrite it?",
	},
	"sv": {
		"acceptFailure": "Ok",
		"add": "Lägg till",
		"addFriend": "Lägg till vän",
		"addNewPerson": "Lägg till ny person",
		"cancel": "Avbryt",
		"done": "OK",
		"failedToLoad": "Misslyckades att ladda",
		"failedToLoad.description": "Något gick fel och vi misslyckades att ladda nätverket.",
		"failedToSave": "Misslyckades att spara",
		"failedToSave.description": "Något gick fel och vi misslyckades att spara nätverket.",
		"fileName": "Filnamn",
		"fileSelected": "En fil vald",
		"friend": "vän",
		"friends": "vänner",
		"load": "Öppna",
		"loading": "Öppnar...",
		"loadNetwork": "Öppna Nätverk",
		"network": "Nätverk",
		"networkAlreadyExists": "Ett nätverk med det namnet finns redan.",
		"newPersonName": "Ny persons namn",
		"noFileSelected": "Ingen fil vald",
		"overwrite": "Skrivöver",
		"overwriteNetwork": "Skrivöver Nätverket",
		"save": "Spara",
		"saveNetwork": "Spara Närverk",
		"saving": "Sparar...",
		"selectImage": "Välj Bild",
		"selectNetwork": "Välj ett nätverk",
		"uploadImage": "Laddaupp Bild",
		"wishToOverwrite": "Vill du skrivaöver det befintliga näverket?",
	},
} as const;

export class i18n {
	private static language: keyof typeof languages;
	private static get Language(): keyof typeof languages {
		if (i18n.language == null) {
			for (const language of navigator.languages) {
				if (language in languages) {
					i18n.language = language;
					break;
				}
			}
		}
		return i18n.language;
	}

	public static GetPhrase(name: Phrases): string {
		return languages[i18n.Language][name];
	}
}

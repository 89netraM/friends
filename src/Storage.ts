import localForage from "localforage";
import { Person } from "./Person";

export class Storage {
	private static readonly Name: string = "friends";

	private static readonly modelsName: string = "models";
	private static modelsForage: LocalForage;
	private static get ModelsForage(): LocalForage {
		if (Storage.modelsForage == null) {
			Storage.modelsForage = localForage.createInstance({
				name: Storage.Name,
				storeName: Storage.modelsName,
			});
		}
		return Storage.modelsForage;
	}

	private static readonly imagesName: string = "images";
	private static imagesForage: LocalForage;
	private static get ImagesForage(): LocalForage {
		if (Storage.imagesForage == null) {
			Storage.imagesForage = localForage.createInstance({
				name: Storage.Name,
				storeName: Storage.imagesName,
			});
		}
		return Storage.imagesForage;
	}

	public static async GetAvailableModels(): Promise<Array<string>> {
		try {
			return await Storage.ModelsForage.keys();
		}
		catch {
			return null;
		}
	}

	public static async LoadModel(name: string): Promise<Array<Person.Properties>> {
		try {
			const model = await Storage.ModelsForage.getItem<Array<Person.Properties>>(name);
			const tasks = new Array<Promise<void>>();
			for (const person of model) {
				if (person.image != null) {
					tasks.push((async () => {
						person.image[1] = await Storage.LoadImage(person.image[0]);
					})());
				}
			}
			await Promise.all(tasks);
			return model;
		}
		catch {
			return null;
		}
	}

	public static async SaveModel(name: string, model: ReadonlyArray<Readonly<Person.Properties>>): Promise<boolean> {
		try {
			const imageIds = new Set<string>((await Storage.GetAvailableImages()) ?? new Array<string>());
			const tasks = new Array<Promise<boolean>>();
			for (const person of model) {
				if (person.image != null && !imageIds.has(person.image[0])) {
					tasks.push((async () => {
						try {
							const response = await fetch(person.image[1]);
							const blob = await response.blob()
							return await Storage.SaveImage(person.image[0], blob);
						}
						catch {
							return false;
						}
					})());
				}
			}
			if ((await Promise.all(tasks)).some(success => !success)) {
				return false;
			}
			await Storage.ModelsForage.setItem(name, model);
			return true;
		}
		catch {
			return false;
		}
	}

	public static async DeleteModel(name: string): Promise<boolean> {
		try {
			const model = await Storage.ModelsForage.getItem<Array<Person.Properties>>(name);
			await Storage.DeleteModel(name);
			const tasks = new Array<Promise<boolean>>();
			for (const person of model) {
				if (person.image != null) {
					tasks.push(Storage.DeleteImage(person.image[0]));
				}
			}
			await Promise.all(tasks);
			return true;
		}
		catch {
			return false;
		}
	}

	public static async GetAvailableImages(): Promise<Array<string>> {
		try {
			return await Storage.ImagesForage.keys();
		}
		catch {
			return null;
		}
	}

	public static async LoadImage(id: string): Promise<string> {
		try {
			const blob = await Storage.ImagesForage.getItem<Blob>(id);
			return URL.createObjectURL(blob);
		}
		catch {
			return null;
		}
	}

	public static async SaveImage(id: string, blob: Blob): Promise<boolean> {
		try {
			await Storage.ImagesForage.setItem(id, blob);
			return true;
		}
		catch {
			return false;
		}
	}

	public static async DeleteImage(id: string): Promise<boolean> {
		try {
			await Storage.ModelsForage.removeItem(id);
			return true;
		}
		catch {
			return false;
		}
	}
}
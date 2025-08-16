import fs from "node:fs";
import YAML from "yaml";

import { openapiSpecification } from "@/docs/config";

const OPENAPI_YAML_DOCUMENT_PATH = "./openapi/openapi-document.yaml";
const OPENAPI_JSON_DOCUMENT_PATH = "./openapi/openapi-document.json";

try {
	const yamlString = YAML.stringify(openapiSpecification);
	fs.writeFileSync(OPENAPI_YAML_DOCUMENT_PATH, yamlString);
	console.info(
		"Wrote to",
		`"${OPENAPI_YAML_DOCUMENT_PATH}".`,
		"Remember to add it in the .gitignore.",
	);
} catch {
	console.error("Failed writing to ", OPENAPI_YAML_DOCUMENT_PATH);
}

try {
	const jsonString = JSON.stringify(openapiSpecification);
	fs.writeFileSync(OPENAPI_JSON_DOCUMENT_PATH, jsonString);
	console.info(
		"Wrote to",
		`"${OPENAPI_JSON_DOCUMENT_PATH}".`,
		"Remember to add it in the .gitignore.",
	);
} catch {
	console.error("Failed writing to ", OPENAPI_JSON_DOCUMENT_PATH);
}

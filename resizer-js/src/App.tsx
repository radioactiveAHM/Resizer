import Main from "./Main"

import "./css/index.css"
import "./css/loader.css"
import "./css/main.css"
import "./css/package.css"

export default function App() {
	return (
		<>
			<Main />
			<div id="info">
				<i>No Uploads or Downloads Required</i>
				<i>
					Developed by{" "}
					<a href="https://github.com/radioactiveAHM">@radioactiveAHM</a>
				</i>
			</div>
		</>
	);
}

import Main from "./main/Main";

export default function App() {
	return (
		<>
			<div class="loader" id="loader"></div>
			<Main />
			<div id="info">
				<i>No Uploads or Downloads Required</i>
				<hr />
				<i>
					Developed by{" "}
					<a href="https://github.com/radioactiveAHM">@radioactiveAHM</a>
				</i>
			</div>
		</>
	);
}

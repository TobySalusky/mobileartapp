export const lightTheme = {
	text: 'black',

	bottomBar: 'lightgray',
	bottomBarBorder: 'gray',
	bottomBarButton: '#333333',

	sideBar: '#eaeaea',
	sideBarBorder: 'gray',

	toolButtonActive: 'red',

	canvasBackground: 'white',


}

export const darkTheme = {
	text: 'lightgray',

	bottomBar: '#444444',
	bottomBarBorder: 'black',
	bottomBarButton: 'lightgray',

	sideBar: '#5b5b5b',
	sideBarBorder: '#111111',

	toolButtonActive: 'orange',

	canvasBackground: 'lightgray',
}

export const otherTheme = (theme) => {
	return (theme === lightTheme) ? darkTheme : lightTheme
}

export const isLightTheme = (theme) => {
	return (theme === lightTheme)
}
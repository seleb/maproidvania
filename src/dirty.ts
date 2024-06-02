let isDirty = false;
export function dirty(newIsDirty = true) {
	isDirty = newIsDirty;
}

// https://stackoverflow.com/a/19538231
window.addEventListener('beforeunload', function (e) {
	if (!isDirty) return;
	const confirmationMessage =
		'You have unsaved changes, are you sure you want to quit?';
	(e || window.event).returnValue = confirmationMessage; //Gecko + IE
	return confirmationMessage; //Webkit, Safari, Chrome
});

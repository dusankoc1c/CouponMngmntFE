export function extractErrorMessage(error: any): string {
  if (error.status === 422 && error.error && error.error.errors) {
    const allMessages: string[] = [];
    const fieldNames = Object.keys(error.error.errors);
    let index: number;

    for (index = 0; index < fieldNames.length; index++) {
      const messagesForField = error.error.errors[fieldNames[index]];
      allMessages.push(messagesForField[0]);
    }

    return allMessages.join(' ');
  }

  return 'Akcija nije uspela.';
}

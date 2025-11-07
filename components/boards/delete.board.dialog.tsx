// Component to Delete Board
/*
#Plan
1. Accept the board id
2. Confirm that the user wants the board deleted
3. Delete the board
*/

import { Text } from "react-native";
import { Button, Dialog } from "react-native-paper";

const DeleteBoardDialog = ({ id }: { id: string }) => {
    return (
        <Dialog visible={false}>
            <Dialog.Title>
                Delete Board
            </Dialog.Title>
            <Dialog.Content>
                <Text>Deleting the board will also delete its lists, tasks, and comments. Are you sure you want to delete the board?</Text>
            </Dialog.Content>
            <Dialog.Actions>
                <Button>Delete</Button>
                <Button>Cancel</Button>
            </Dialog.Actions>
        </Dialog>
    )
}

export default DeleteBoardDialog;
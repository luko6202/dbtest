import React, {Component} from 'react';
import './App.css';
import {Button, Stack, TextField} from "@mui/material";
import {getDb} from "./Database";
import { RxDatabase, RxCollection, PouchStorageInternals, PouchSettings } from 'rxdb';

interface IProps {
}

interface IState {
    chatData?: any;
    message: string;
}

class App extends Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);

        this.state = {
            chatData: [],
            message: ''
        }
    }

    async componentDidMount() {
        /*this.db.then(async db => {
            this.setState({chatData: await db.chats.find().exec()});
            console.log('docs', this.state.chatData);
        });*/
    }

    public onSend = async() => {
        getDb().then(
            (database:any) => database.chats.upsert({
                message_id: Date.now().toString(),
                message: this.state.message
            })
        )

        console.log('m: ', this.state.message)
    }

    public onFetch = async() => {
        getDb().then(
            async (database:any) => {
                database.chats.find().exec().then(
                    (chatData:any) => this.setState({chatData}, () => {
                        console.log('fetched', chatData);
                    })
                )   
            }
        )
    }

    render() {
        const {chatData} = this.state
        return (
            <div className="App">
                <Stack spacing={2}>
                    <TextField id="outlined-basic" label="Message" variant="outlined" value={this.state.message}
                               onChange={e => this.setState({message: e.target.value})}/>
                    <Button variant="outlined" onClick={this.onSend}>Send message</Button>
                    <Button variant="outlined" onClick={this.onFetch}>Fetch data</Button>
                    {chatData?.map((e:any) => {
                        return (<div>{e.message}</div>);
                    })}
                </Stack>
            </div>
        )
    }
}
export default App;

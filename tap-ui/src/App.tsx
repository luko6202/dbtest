import React, {Component} from 'react';
import './App.css';
import {Button, Stack, TextField} from "@mui/material";
import {_create} from "./Database";

interface IProps {
}

interface IState {
    chatData?: any;
    message: string;
}

class App extends Component<IProps, IState> {

    public onSend = () => {
        this.db.then(async database => {
            await database.chats.insert({
                message_id: Date.now().toString(),
                message: this.state.message
            });

            console.log('m: ', this.state.message)
        });
    }

    public onFetch = () => {
        this.db.then(async db => {
            this.setState({chatData: await db.chats.find().exec()});

            console.log('fetched', this.state.chatData);
        });
    }

    private db = _create();

    constructor(props: IProps) {
        super(props);

        this.state = {
            chatData: null,
            message: ''
        }
    }

    async componentDidMount() {
        /*this.db.then(async db => {
            this.setState({chatData: await db.chats.find().exec()});
            console.log('docs', this.state.chatData);
        });*/
    }

    render() {

        return (
            <div className="App">
                <Stack spacing={2}>
                    <TextField id="outlined-basic" label="Message" variant="outlined" value={this.state.message}
                               onChange={e => this.setState({message: e.target.value})}/>
                    <Button variant="outlined" onClick={this.onSend}>Send message</Button>
                    <Button variant="outlined" onClick={this.onFetch}>Fetch data</Button>
                    {this.state.chatData?.map((e:any) => {
                        return (<div>{e.message}</div>);
                    })}
                </Stack>
            </div>
        )
    }
}
export default App;

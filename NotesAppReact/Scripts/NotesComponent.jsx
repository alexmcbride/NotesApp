
const router = new Navigo(null, true, '#!');

class Note extends React.Component {
    onSelectNote(evt) {
        router.navigate('/notes/' + this.props.noteid);

        evt.preventDefault();
    }

    render() {
        return <div className="note">
            <h2><a href="#" onClick={this.onSelectNote.bind(this)}>{this.props.title}</a></h2>
            <p>{this.props.content}</p>
        </div>;
    }
}

class NotesList extends React.Component {
    render() {
        const data = this.props.data;

        const noteList = data.map((note) =>
            <Note key={note.Id} noteid={note.Id} title={note.Title} content={note.Content} />
        );

        return <div className="notes-list">{noteList}</div>;
    }
}

class NotesComponent extends React.Component {
    constructor(props) {
        super(props);

        // Set intial state.
        this.state = { data: [] };
    }

    componentDidMount() {
        // Get JSON from API and set as state.
        const url = "http://localhost:51781/api/notes";
        $.getJSON(url, function (data) {
            this.setState({ data: data });
        }.bind(this));
    }

    onAddNote(evt) {
        router.navigate('/notes/add');
        evt.preventDefault();
    }

    render() {
        return <div className="notes-component">
            <h1>Notes</h1>
            <NotesList data={this.state.data} />
            <form onSubmit={this.onAddNote}>
                <input type="submit" value="Add Note" />
            </form>
        </div>;
    }
}

class NoteComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = { note: {} };
    }

    componentDidMount() {
        // Get JSON from API and set as state.
        const url = "http://localhost:51781/api/notes/" + this.props.id;
        $.getJSON(url, function (data) {
            console.log(data);
            this.setState({ note: data });
        }.bind(this));
    }

    onGoBack(evt) {
        router.navigate();
    }

    render() {
        return <div className="note-component">
            <Note noteid={this.state.note.Id} title={this.state.note.Title} content={this.state.note.Content} />

            <form>
                <input type="button" value="Go back..." onClick={this.onGoBack} />
            </form>
        </div>;
    }
}

class AddNoteComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = { title: '', content: '' };
    }

    onTitleChanged(evt) {
        this.setState({ title: evt.target.value,  });
    }

    onContentChanged(evt) {
        this.setState({ content: evt.target.value });
    }

    onAddNote(evt) {
        const note = {
            Title: this.state.title,
            Content: this.state.content,
            Created: new Date().toUTCString()
        };

        console.log(note);

        $.ajax({
            type: 'POST',
            url: 'http://localhost:51781/api/Notes',
            data: JSON.stringify(note),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            success: function (data) {
                router.navigate('/notes/' + data.Id);
            },
            failure: function (errMsg) {
                alert("Error: " + errMsg);
            }
        });
        evt.preventDefault();
    }

    onGoBack(evt) {
        router.navigate();
    }

    render() {
        return <div className="add-note">
            <form onSubmit={this.onAddNote.bind(this)}>
                <h1>Add Note</h1>

                <label>
                    Title<br/>
                    <input type="text" onChange={this.onTitleChanged.bind(this)} />
                </label>

                <br />

                <label>
                    Content<br />
                    <textarea onChange={this.onContentChanged.bind(this)}></textarea>
                </label>

                <br />

                <input type="submit" value="Add Note" />
                &nbsp;&nbsp;
                <input type="button" value="Go back" onClick={this.onGoBack.bind(this)} />
            </form>
        </div>;
    }
}

// Handle displaying components.
const content = document.getElementById("content");
router.on('/notes/add', function () {
    ReactDOM.render(<AddNoteComponent />, content);
}).on('/notes/:id', function (params, query) {
    ReactDOM.render(<NoteComponent id={params.id} />, content);
}).on('*', function () {
    ReactDOM.render(<NotesComponent />, content);
}).resolve();

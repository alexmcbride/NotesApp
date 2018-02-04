
// Global variable for handling routes
const router = new Navigo(null, true, '#!');

class Note extends React.Component {
    onSelectNote(evt) {
        router.navigate('/notes/' + this.props.noteid);
        evt.preventDefault();
    }

    onDeleteNote(evt) {
        // Call onRemoveNote event in parent component, passing in note ID.
        this.props.onRemoveNote(evt, this.props.noteid);
    }

    render() {
        // Conditionally show delete button.
        let button = null;
        if (this.props.showDelete) {
            button = <a href="#" onClick={this.onDeleteNote.bind(this)}>Delete</a>;
        }

        return <div className="note">
            <h2><a href="#" onClick={this.onSelectNote.bind(this)}>{this.props.title}</a></h2>
            <p>{this.props.content}</p>
            {button}
        </div>;
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

    onRemoveNote(evt, id) {
        // Remove the note and update the component state
        const url = "http://localhost:51781/api/notes/" + id;
        $.ajax({
            type: 'DELETE',
            url: url,
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            success: function (newData) {
                var items = this.state.data.filter((note) => note.Id !== newData.Id);
                this.setState({ data: items });
            }.bind(this),
            failure: function (errMsg) {
                alert("Error: " + errMsg);
            }
        });
    }

    render() {
        // Create list of notes to display.
        const noteList = this.state.data.map(function (note) {
            return <Note key={note.Id} noteid={note.Id} title={note.Title} content={note.Content} onRemoveNote={this.onRemoveNote.bind(this)} showDelete={true} />;
        }.bind(this));

        return <div className="notes-component">
            <h1>Notes</h1>
            {noteList}
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
            this.setState({ note: data });
        }.bind(this));
    }

    onGoBack(evt) {
        router.navigate();
        evt.preventDefault();
    }

    render() {
        // Render a single note
        return <div className="note-component">
            <Note noteid={this.state.note.Id} title={this.state.note.Title} content={this.state.note.Content} showDelete={false} />
        
            <a href="#" onClick={this.onGoBack}>Go back...</a>
        </div>;
    }
}

class AddNoteComponent extends React.Component {
    constructor(props) {
        super(props);
        // Set initial state.
        this.state = { title: '', content: '' };
    }

    onTitleChanged(evt) {
        // When content of text input changes update the state
        this.setState({ title: evt.target.value,  });
    }

    onContentChanged(evt) {
        // When content of text input changes update the state
        this.setState({ content: evt.target.value });
    }

    onAddNote(evt) {
        // TODO: react validation? generic javascript validation?
        const note = {
            Title: this.state.title,
            Content: this.state.content,
            Created: new Date().toUTCString()
        };

        // Add note through API
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
        router.navigate(); // Go to root view
        evt.preventDefault();
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
                &nbsp;|&nbsp;
                <a href="#" onClick={this.onGoBack.bind(this)}>Go back</a>
            </form>
        </div>;
    }
}

// Route URLs to the components we want them to display
const content = document.getElementById("content");
router.on('/notes/add', function () {
    // Display add note component.
    ReactDOM.render(<AddNoteComponent />, content);
}).on('/notes/:id', function (params, query) {
    // Show a component displaying the specified note
    ReactDOM.render(<NoteComponent id={params.id} />, content);
}).on('*', function () {
    // Root component.
    ReactDOM.render(<NotesComponent />, content);
}).resolve();

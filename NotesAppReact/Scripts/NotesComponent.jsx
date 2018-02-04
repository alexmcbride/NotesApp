
// Routing stuff
var content = document.getElementById("content");
var router = new Navigo(null, true, '#!');

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
        console.log("Submit!!");
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
        </div>
    }
}

router.on('/notes/:id', function (params, query) {
    ReactDOM.render(<NoteComponent id={params.id} />, content);
}).on('*', function () {
    ReactDOM.render(<NotesComponent />, content);
}).resolve();

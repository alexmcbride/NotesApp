
class Note extends React.Component {
    render() {
        return <div className="note">
            <h2>{this.props.title}</h2>
            <p>{this.props.content}</p>
        </div>;
    }
}

class NotesList extends React.Component {
    render() {
        const data = this.props.data;

        const noteItems = data.map((note) =>
            <Note key={note.Id} title={note.Title} content={note.Content} />
        );

        return (
            <div className="notes-list">{noteItems}</div>
        );
    }
}

class NotesComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = { data: [] };
    }

    componentDidMount() {
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

ReactDOM.render(<NotesComponent />, document.getElementById("content"));

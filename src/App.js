import './App.css';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import React, { useState, useEffect } from 'react';
import TextField from '@material-ui/core/TextField';
import Box from '@material-ui/core/Box';
import { ThemeProvider } from "@material-ui/styles"
import { createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme({
  palette: {
    type: 'light',
  },
})

class EventCard extends React.Component {
  render() {
    return(
      <ThemeProvider theme={theme}>
          <Box m={1}>
            <Card style={{minWidth: 400, pallete: { type: "dark" }}}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Event {this.props.index+1}:
              </Typography>
              <Typography 
                variant="h5"
                style={{textDecoration: this.props.isComplete ? "line-through" : "", opacity: this.props.isComplete ? 0.4 : 1}}
              >
                {this.props.data}
              </Typography>
            </CardContent>
            <CardActions>
              <Button size="small" onClick={() => this.props.setComplete(this.props.id, this.props.data, !this.props.isComplete)}>Complete</Button>
              <Button size="small" onClick={() => this.props.deleteEvent(this.props.id)}>Delete</Button>
            </CardActions>
          </Card>
        </Box>
      </ThemeProvider>
    )
  }
}

class AddButton extends React.Component {
  constructor(props) {
    super(props);
    
    this.handleSubmission = this.handleSubmission.bind(this);

    this.state = {
      errorText: '',
      error: false,
      text: '',
    }
  }

  onChange(event) {
    this.setState({ text: event.target.value })
    if(event.target.value.length === 0) {
      this.setState({ errorText: "New event cannot be empty", error: true})
    } else {
      this.setState({ errorText: "", error: false })
    }
  }

  handleSubmission(e) {
    e.preventDefault()
    this.props.addEvent(this.state.text, false)
    this.setState({ text: "" })
  }

  render() {
    return(
      <form onSubmit={(e) => this.handleSubmission(e)} style={{marginBottom: 15}}>
          <TextField
            value={this.state.text} 
            required={true}
            id="filled-basic"
            error={this.state.error}
            label="New Event" 
            variant="filled"
            helperText={this.state.text === "" && !this.state.error ? "Add a new Event!" : this.state.text === "" && this.state.error ? "Field cannot be empty" : ""}
            errortext={this.state.errorText} 
            onChange={this.onChange.bind(this)}
            style={{marginTop: 15}}
            InputProps={{
              theme: theme
            }}
          />
      </form>
    )
  }
}

const EventStack = () => {
  const [events, setEvents] = useState([]);

  const getEvents = () => {
    (async() => {
      try {
        const response = await fetch('https://localhost:5001/api/TodoItems', {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
        });
        let json = await response.json();
        setEvents(json);
      } catch (error) {
        console.log(error);
      }
    })();
  }

  const addEvent = (text, isComplete) => {
    setEvents([...events, {data: text}]);
    (async() => {
      try {
        await fetch(`https://localhost:5001/api/TodoItems`, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: text,
            isComplete: isComplete,
          })
        });
        getEvents();
      } catch (error) {
        console.log(error);
      }
    })();
  }

  const deleteEvent = (id) => {
    (async() => {
      try {
        await fetch(`https://localhost:5001/api/TodoItems/${id}`, {
          method: 'DELETE',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
        });
        getEvents();
      } catch (error) {
        console.log(error);
      }
    })();
  }

  const setComplete = (id, name, newIsComplete) => {
    (async() => {
      try {
        await fetch(`https://localhost:5001/api/TodoItems/${id}`, {
          method: 'PUT',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: id,
            name: name,
            isComplete: newIsComplete,
          })
        });
        getEvents();
      } catch (error) {
        console.log(error);
      }
    })();
  }

  useEffect(() => {
    getEvents();
    // eslint-disable-next-line
  }, []);

  let eventBoxes = events.map((event, index) => {
    return <EventCard key={index} index={index} id={event.id} data={event.name} isComplete={event.isComplete} deleteEvent={deleteEvent} setComplete={setComplete} />
  })

  return (
    <div id="event-container">
      <h1>Your To-Do-List.</h1>
      <AddButton addEvent={addEvent} />
      {eventBoxes}
    </div>
  )
}

function App() {
  return (
    <EventStack />
  )
}

export default App;

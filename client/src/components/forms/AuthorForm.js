import { Button, MenuItem, TextField, Typography } from '@material-ui/core'
import { Autocomplete } from '@material-ui/lab'
import React, { Component } from 'react'
import { getDateFormatted } from '../../helpers/helpers'
import { createAuthor, searchBirthPlace, updateAuthor } from '../../services/authorServices'
import CreateEntityModal from '../CreateEntityModal'

const genders = ['Male', 'Female']
const genderMap = { 'M': 'Male', 'F': 'Female' }

export default class AuthorForm extends Component {
  constructor(props) {
    super(props)

    this.state = {
      isOpen: false,
      isSaving: false,
      bpInput: '',
      bpResults: [],
      birthPlace: null, // {birthplace: string, birthplace_id: int}
      gender: '',
      name: '',
      birth_date: null,
      death_date: null,
      author_id: null,
    }
  }

  componentDidMount() {
    if (this.props.mode === 'update' && this.props.author) {
      const { birthplace, birthplace_id, gender } = this.props.author
      this.setState({
        ...this.props.author,
        birthPlace: { birthplace, birthplace_id },
        gender: genderMap[gender] || gender,
      })
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (!prevState.isOpen && this.state.isOpen) {
      this.fetchBirthPlaces()
    }
  }

  fetchBirthPlaces = async () => {
    const result = await searchBirthPlace('')
    if (result) {
      this.setState({ bpResults: result })
    }
  }

  // TODO: if saved print succes message
  render() {
    return (
      <div className='my-1'>
        <Button style={this.props.style} onClick={this.handleOpen} >
          <Typography variant='body1'>
            {this.props.text}
          </Typography>
        </Button>
        <CreateEntityModal
          isOpen={this.state.isOpen}
          isSaving={this.state.isSaving}
          title={this.props.title}
          onSave={this.handleSave}
          onClose={this.handleClose}
          onOpen={this.handleOpen}
        >
          {this.renderForm()}
        </CreateEntityModal>
      </div>
    )
  }

  renderForm = () => {
    return (
      <div className='flex-column mx-1 px-1' style={{ width: '90vw', maxWidth: '400px' }}>
        <TextField required className='mb-1' name='name' label='Author Name' type='text' variant='outlined'
          value={this.state.name} onChange={this.handleChange} />
        <Autocomplete
          value={this.state.birthPlace}
          onChange={(ev, newVal) => this.setState({ birthPlace: newVal })}
          inputValue={this.state.bpInput}
          onInputChange={(ev, newVal) => this.setState({ bpInput: newVal })}
          options={this.state.bpResults}
          getOptionLabel={(option) => option.birthplace}
          style={{ width: '300' }}
          renderInput={(params) => <TextField {...params} label="Birth Place" type='text' variant="outlined" />}
        />
        <TextField className='mb-1' select variant='outlined' label='Gender' type='text' name='gender'
          value={this.state.gender} onChange={this.handleChange} >
          {genders.map(option =>
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>)}
        </TextField>
        <TextField required className='mb-1' InputLabelProps={{ shrink: true }} variant='outlined' label='Birth Date'
          type='date' name='birth_date' value={this.state.birth_date} onChange={this.handleChange} />
        <TextField required className='mb-1' InputLabelProps={{ shrink: true }} variant='outlined' label='Death Date'
          type='date' name='death_date' value={this.state.death_date} onChange={this.handleChange} />
      </div>
    )
  }

  renderBirthPlaces = () => {
    const results = this.state.bpResults
    if (!results) return

  }

  handleChange = (ev) => {
    this.setState({
      [ev.target.name]: ev.target.value
    })
  }

  handleSave = async () => {
    const { name, birth_date, death_date, gender, author_id } = this.state
    const { birthplace_id } = this.state.birthPlace
    const { mode } = this.props
    this.setState({ isSaving: true })
    const data = { name, birthplace_id, birth_date, death_date, gender };
    const response = mode === 'update' ? await updateAuthor(author_id, data) : await createAuthor(data)
    console.log(response)
    if (response && response.status) {
      this.setState({ saved: true })
      if (mode === 'create' && response.author_id) {
        this.props.history.push('/authors/' + response.author_id)
      }
    }
    this.handleClose()
  }

  handleOpen = () => {
    this.setState({ isOpen: true })
  }

  handleClose = () => {
    this.setState({ isOpen: false, isSaving: false })
  }
}

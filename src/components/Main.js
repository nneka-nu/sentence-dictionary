import React from 'react';

import RecentSearches from './RecentSearches';

class Main extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      formError: ''
    }

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleSearchClick = this.handleSearchClick.bind(this);
  }

  handleSubmit(e) {
    const searchValue = this.search.value.trim();

    if (!searchValue || !(/^[a-zA-Z]+$/).test(searchValue)) {
      e.preventDefault();
      this.setState({ formError: 'Please enter a valid word.' });
      return;
    }

    this.setState({ isLoading: 'Loading...' });
  }
  
  handleSearchClick(e) {
    this.setState({ isLoading: 'Loading...' });
  }

  render() {
    const { status, sentences, recentSearches, searchTerm } = this.props;
    const { isLoading, formError } = this.state;
    let errorMsg = null;
    
    if (status === 500) {
      errorMsg = 'Your request could not be processed. Please try again later.';
    } else if (status === 404 || (searchTerm && sentences.length === 0)) {
      errorMsg = 'No sentences found.';
    }

    return (
      <div className="container">
        <h2>Sentence Dictionary</h2>
        <form action="/" method="post">
          <input
            id="search"
            name="search"
            type="text"
            ref={search => this.search = search}
            defaultValue={this.props.searchTerm}
            placeholder="Type word..."
          />
          <button id="submit" onClick={this.handleSubmit}>
            Submit
          </button>
        </form>
        {formError && !isLoading && <p style={{color: 'red'}}>{formError}</p>}
        {isLoading && <p>{isLoading}</p>}
        {errorMsg && !isLoading && <p>{errorMsg}</p>}
        <div className="search-results">
          {recentSearches.length > 0 &&
            <RecentSearches
              searches={recentSearches}
              onSearchClick={this.handleSearchClick}
            />
          }
          {sentences.length > 0 && 
            <ol>
              {sentences.map((sentence, i) => {
                return <li key={"sentence-" + i}>{sentence}</li>
              })}
            </ol>
          }
        </div>
      </div>
    );
  }
}

export default Main;
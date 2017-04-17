import React from 'react';

function RecentSearches({ searches, onSearchClick }) {
    return (
      <div className="recent-searches">
        <p>Recent Searches</p>
        <ul>
          {searches.map((search, i) => {
            return (
              <li key={"search-" + i}>
                <form id="search-word" action={"/?search=" +search} method="post">
                  <button type="submit" onClick={onSearchClick}>
                    {search}
                  </button>
                </form>
                <form id="search-delete" action={"/search/delete/" +search + '/?_method=DELETE'} method="post">
                  <input type="hidden" name="_method" value="DELETE" />
                  <button type="submit" title="Delete">x</button>
                </form>
              </li>
            )
          })}
        </ul>
      </div>
    );
}

export default RecentSearches;
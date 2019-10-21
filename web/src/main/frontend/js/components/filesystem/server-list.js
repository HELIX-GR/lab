import React from 'react';
import { FormattedTime } from 'react-intl';

const ServerList = ({ kernels, servers, selectServer }) => (
  <div className="main-results-result-count-lab">
    <a> Select a server to run your notebooks and see your files</a>

    <div className="result-items">
      {servers.map(server => (

        <div className="result-item lab server" key={server.id}>
          <div className="date-of-entry">
            <div>{server.startedAt ? <FormattedTime value={server.startedAt} day='numeric' month='numeric' year='numeric' /> : "---"} </div>
          </div>

          <h3 className="title">
            <a className="mr-2" >{server.name} </a>
            <div className="pill data">
              {server.memory > 1024 ? `${(server.memory / 1024).toFixed(1)} GB` : `${server.memory} MB`} RAM
            </div>
            <div className="pill data">
              {server.virtualCores} VC
            </div>
          </h3>

          <div className="service">
            <a >{server.description}</a>
          </div>

          <div className="tag-list">
            {server.tags.map((tag) => (
              <a key={tag} className="tag-box tag-box-other">{tag}</a>
            ))}
          </div>

          <div className="service">
            <a>Available Kernels</a>
          </div>
          <div className="tag-list">
            {server.kernels.map((name) => {
              const kernel = kernels.find(k => k.name === name);
              return (
                <a key={kernel.name}
                  className="tag-box tag-box-other kernel"
                  onClick={(e) => {
                    e.preventDefault();

                    selectServer(server, kernel);
                  }}
                >
                  {kernel.tag}
                </a>
              );
            })}
          </div>
        </div>
      )
      )}
    </div>
  </div>

);

export default ServerList;

import * as React from 'react';
import { Courses }  from './landing/courses';


import {
  FormattedMessage,
} from 'react-intl';

const cardInfo = [
  {
    title : "Research for Data",
    description : "Azure Notebooks provides execution environments for Python 2, Python 3, F#, and R.",
    link : {
      ref : "",
      text : "Use the languages of Data Science",
    },
  },
  {
    title : "Research for Data",
    description : "Azure Notebooks provides execution environments for Python 2, Python 3, F#, and R. ",
    link : {
      ref : "#",
      text : "Use the languages of Data Science",
    },
  }
];

const CoursesCardInfo = [
  {
    title : "Introduction to Python",
    description : "Learn the basics of Python 3 in Helix Lab Notebooks. Learn Python syntax, standard data types, as well as how to write a simple program. ",
    image : "images/svg/Python.svg",
    link : {
      ref: "#",
      text : "Use the languages of Data Science",
    },
  },
  {
    title: "Introduction to R",
    description: "Get a brief introduction to charting and graphing capabilities of R in the Jupyter Notebook. You will learn how to make line charts, pie charts and scatter plots. ",
    image: "images/svg/R.svg",
    link: {
      ref: "#",
      text: "Use the languages of Data Science",
    },
  },
  {
    title: "Introduction to F#",
    description: "Get a brief introduction to using F# in the Jupyter Notebook.",
    image: "images/svg/F.svg",
    link: {
      ref: "#",
      text: "Use the languages of Data Science",
    },
  },
  {
    title: "Introduction to Python 3",
    description: "Learn the basics of Python 3 in Helix Lab Notebooks. Learn Python syntax, standard data types, as well as how to write a simple program. ",
    image: "images/svg/python3.svg",
    link: {
      ref: "#",
      text: "Use the languages of Data Science",
    },
  }
];


class LabFeatured extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <section className="lab-landing-page-content">

        <div className="featured-lab-container container-fluid">
          <div className="row">



            <div className="col-md-6 col-sm-6 col-xs-12">
              <div className="main-lab-item">

                <h2 className="main-lab-item-title">
                  Interactive coding in your browser
              </h2>

                <div className="main-lab-item-subtitle">
                  Free, in the cloud, powered by Jupyter
              </div>

              </div>
            </div>
            {cardInfo.map((r, key) => (
              <div className="col-md-3 col-sm-6 col-xs-12" key={key}>
                <div className="lab-item">
                  <h3 className="lab-title">
                    <a href="#"> {r.title} </a>
                  </h3>
                  <div className="lab-description">
                    {r.description}
                  </div>
                  <div className='lab-action-link'>
                    <a href={r.link.ref}> {r.link.text} </a>
                  </div>
                </div>
            </div>)
            )}
          </div>
        </div>
        <Courses info={CoursesCardInfo}/>
        
      </section>
    );
  }
}

export default LabFeatured;

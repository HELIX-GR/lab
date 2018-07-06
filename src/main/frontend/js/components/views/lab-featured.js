import * as React from 'react';
import { Courses } from './landing/courses';


import {
  FormattedMessage,
} from 'react-intl';

const cardInfo = [
  {
    title: <FormattedMessage id="featured.first.title" defaultMessage="Notebook repository" />,
    description: <FormattedMessage id="featured.first.description" defaultMessage="Find interesting projects in Python, Julia, F#, and R to copy to your folder." />,
    link: {
      ref: "",
      text: <FormattedMessage id="featured.first.text" defaultMessage="Search for Notebooks" />,
    },
  },
  {
    title: <FormattedMessage id="featured.second.title" defaultMessage="ACM – Europe Summer School 2018" />,
    description: <FormattedMessage id="featured.second.description" defaultMessage="Η ACM προσκαλεί τους φοιτητές στο Ευρωπαϊκό Θερινό Σχολείο (Europe Summer School) για την επιστήμη των δεδομένων." />,
    link: {
      ref: "",
      text: <FormattedMessage id="featured.second.text" defaultMessage="Show me!" />,
    },
  }
];

const CoursesCardInfo = [
  {
    title: "How to use Jupyter Notebooks",
    description: "Get a brief introduction guide not to get lost in your first steps with Jupyter Notebook.",
    image: "images/jupyter.svg",
    link: {
      ref: "#",
      text: "Start Now",
    },
  },
  {
    title: <FormattedMessage id="featured.second.title" defaultMessage="What is Helix Lab" />,
    description: <FormattedMessage id="featured.second.description" defaultMessage="All you need to know about the Helix Lab and how to use it." />,
    image: "images/svg/Lab-logo.svg",
    link: {
      ref: "#",
      text: <FormattedMessage id="featured.second.text" defaultMessage="Show me!" />,
    },
  },
  {
    title: "Online Courses",
    description: "We have lunched an Online Courses feature. Learn how to create or join one and why you should.",
    image: "images/online_courses.svg",
    link: {
      ref: "#",
      text: "Take me there!",
    },
  },
  {
    title: "Tips for Data Visualization",
    description: "Your data is only as good as your ability to understand and communicate it, which is why choosing the right visualization/ chart is essential",
    image: "images/data_vis.png",
    link: {
      ref: "#",
      text: "Take me to blog post",
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
        <Courses info={CoursesCardInfo} />

      </section>
    );
  }
}

export default LabFeatured;

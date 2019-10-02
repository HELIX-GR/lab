import * as React from 'react';

import { FormattedMessage } from 'react-intl';

import { Courses } from './courses';
import { StaticRoutes } from '../../../model/routes';

const cardInfo = [
  {
    title: <FormattedMessage id="featured.first.title" defaultMessage="What is HELIX Lab?" />,
    description: <FormattedMessage id="featured.first.description" defaultMessage="It’s your own private data infrastructure for learning, sharing, and building with data. You can bring your own data or use our open scientific data, interactively code in your language of choice, experiment over dedicated Big Data clusters or our HPC, and share your work with others. " />,
    link: {
      ref: StaticRoutes.CORE + "/news/view/300",
      text: <FormattedMessage id="featured.first.text" defaultMessage="Learn more about Lab and how to use it." />,
    },
  },
  {
    title: <FormattedMessage id="featured.second.title" defaultMessage="Academic Support" />,
    description: <FormattedMessage id="featured.second.description" defaultMessage="Integrate Lab in your official undergraduate, postgraduate or seminar curricula. Organize courses with your own data, exercises, and tests.  Your students can learn about statistics, data management, and machine learning. No infrastructure, installation, or setup costs! " />,
    link: {
      ref: StaticRoutes.CORE + "/project/page/contact",
      text: <FormattedMessage id="featured.second.text" defaultMessage="See the list of courses." />,
    },
  }
];

const CoursesCardInfo = [
  {
    title: "Notebook Repository",
    description: "Find interesting notebooks created and shared by others, copy them in your own space, and use them anyway you want. Also, why don’t you also share your work with others?",
    image: "images/code.svg",
    link: {
      ref: "/results",
      text: "See all public notebooks",
    },
  },
  {
    title: "Learn Jupyter",
    description: "Whether you are a novice, or an expert notebook user, start here. We have assembled a collection of educational resources, guides, examples and online courses to help you start using Jupyter in your own research.",
    image: "images/jupyter.svg",
    link: {
      ref: "https://jupyter-notebook-beginner-guide.readthedocs.io/en/latest/",
      text: "Start learning",
    },
  },
  {
    title: "The JupyterLab Interface",
    description: "JupyterLab provides flexible building blocks for interactive,\
     exploratory computing. While JupyterLab has many features found in traditional \
     integrated development environments (IDEs), it remains focused on interactive, exploratory computing.",
    image: "",
    link: {
      ref: "https://jupyterlab.readthedocs.io/en/latest/user/interface.html",
      text: "Take me to the guide",
    },
  },
  {
    title: "Featured notebooks",
    description: "A curated collection of Jupyter/IPython notebooks that are notable. \
    This list contains many notebooks in fields like Statistics, Machine Learning and Data Science \
    Mathematics, Physics, Chemistry, Biology and many others.",
    image: "images/online_courses.svg",
    link: {
      ref: "https://github.com/jupyter/jupyter/wiki/A-gallery-of-interesting-Jupyter-Notebooks",
      text: "Take me there!",
    },
  },

];

const Featured = () => {
  return (
    <section className="lab-landing-page-content">

      <div className="featured-lab-container container-fluid">
        <div className="row">
          <div className="col-md-6 col-sm-6 col-xs-12">
            <div className="main-lab-item">

              <h2 className="main-lab-item-title">
                A Data Science Laboratory in your browser

                </h2>

              <div className="main-lab-item-subtitle">
                Create and share notebooks with live interactive code and visualizations over scientific data and large-scale computing infrastructures within your browser.
                </div>

            </div>
          </div>

          {cardInfo.map((r, key) => (
            <div className="col-md-3 col-sm-6 col-xs-12" key={key}>
              <div className="lab-item">
                <h3 className="lab-title">
                  <a href={r.link.ref}> {r.title} </a>
                </h3>
                <div className="lab-description">
                  {r.description}
                </div>
                <div className='lab-action-link'>
                  <a href={r.link.ref}> {r.link.text} </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Courses info={CoursesCardInfo} />

    </section>
  );
};

export default Featured;

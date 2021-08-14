import { IonCol, IonContent, IonGrid, IonPage, IonRow } from '@ionic/react';
import React, { Component } from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
// import routes from '../../routes';
// import Page from '../../components/Page/Page';
// import Button from '../../components/Button/Button';
import styles from './Home.module.scss';
import Start from '../Start/Start';
import { Link, Element } from 'react-scroll';

interface HomeProps extends RouteComponentProps {}

class Home extends Component<HomeProps> {
  constructor(props: HomeProps) {
    super(props);
    //@ts-ignore
    this['box'] = React.createRef();
  }

  scrollToCategory = (id: any) => {};

  render() {
    return (
      <div className={styles.container}>
        <div className={styles.bannerContainer}>
          <img src='./assets/homeBanner.png' alt='' />
        </div>
        <div style={{ width: '95%', display: 'flex' }}>
          <div className={styles.leftSideBanner}>
            <div className={styles.leftSideBannerContainer}>
              <div className={styles.leftSideBannerTitle}>Why choose Music Fun with my Little One</div>
              <hr className={styles.leftSideBannerHozer} />
            </div>
            <div className={styles.leftSideBannerSubText}>“I want to share a special activity with my child, and include other family members”</div>
            <div className={styles.leftSideBannerSubText}>“I want to introduce the love of music with my Little One in a fun environment”</div>
            <div className={styles.leftSideBannerSubText}>“I want a new and unique program to share activities with my child” </div>
            <div className={styles.leftSideBannerSubText}> “I want my child to benefit from music as a resource for better learning skills” </div>
            <div className={styles.leftSideBannerSubText}>
              “I want to watch my grandchild having fun in a safe place” I love that I can see my kids doing something they love “I want my child to
              build confidence”
            </div>
            <div className={styles.leftSideBannerSubText}> “I want my child to build confidence” </div>
            <div className={styles.leftSideBannerSubText}> “I want my child to experience something new that they can love” </div>
            <div className={styles.leftSideBannerSubText}> “I want me and my child to be entertained and engaged in a fun program”</div>
            <div className={styles.leftSideBannerSubText}> “I love that we can be in a program and share it with family and friends “ </div>
            <div className={styles.leftSideBannerSubText}>“I want a program to meet other families and new friends” </div>
            <div className={styles.leftSideBannerSubText}> “I am a single Dad, I’m always looking for something to do when I have my daughter”</div>
            <div className={styles.leftSideBannerSubText}>“I love music and want to share it with my 3 year old” </div>
          </div>
          <div className={styles.subContainer}>
            <div className={styles.contentContainer}>
              <div className={styles.subContentContainer}>
                <div className={styles.subContentContainerBelow}>
                  <div className={styles.mainContainer}>
                    <div className={styles.mainSubContainer}>
                      <div className={styles.mainSubContainer1}>
                        <img src='./assets/kidpic.png' alt='' />
                      </div>
                    </div>
                  </div>
                  <div className={styles.titleTxt}>Meet up with friends & family from anywhere, share our spectecular music journey. </div>
                </div>

                {/* <div className={styles.btnContainer}>
                  {this.props.children}
                  <div className={styles.MFLO}>
                    <Link
                      activeClass='activeCategoryLink'
                      to={'box'.toString()}
                      spy={true}
                      smooth={true}
                      duration={500}
                      offset={-50}
                      onSetActive={() => {
                        this.scrollToCategory('box');
                      }}>
                      What is Music Fun with your Little One?
                    </Link>
                  </div>
                </div> */}
              </div>
              <div className={styles.lowerContainer}>
                <Element name={'box'.toString()} className={'box'} key={'display'}>
                  <div className={styles.lowerSubContainer}>
                    <img src='./assets/lower1.png' width='47%' height='80%' alt='' />
                    <div className={styles.textContainer}>
                      <div className={styles.highlightedtxt}>What is Music Fun with your Little One?</div>
                      <div className={styles.text}>
                        An enjoyable Parent/Guardian and Child experience with a live Instructor taking you on a journey of music appreciation.
                      </div>
                    </div>
                  </div>
                </Element>
                <div className={styles.lowerSubContainer}>
                  <div className={styles.textContainer}>
                    <div className={styles.highlightedtxt}>About our programs</div>
                    <div className={styles.text}>
                      We provide a group program with friends, families, groups and schools to interact and discover to joy of music.{' '}
                    </div>
                  </div>
                  <img src='./assets/lower2.png' width='47%' height='80%' alt='' />
                </div>
                <div className={styles.lowerSubContainer}>
                  <img src='./assets/lower3.png' width='47%' height='80%' alt='' />
                  <div className={styles.textContainer}>
                    <div className={styles.highlightedtxt}>Music Fun... is #1 </div>
                    <div className={styles.text}>Best of all, you get to share your experience with your favorite people connecting online.. </div>
                  </div>
                </div>
                <div className={styles.lowerSubContainer}>
                  <div className={styles.textContainer}>
                    <div className={styles.highlightedtxt}>How do I sign up?</div>
                    <div className={styles.text}>
                      Register and set up your day and time, Bring or join a group and start your music journey. It’s as easy as 1,2,3 & 4{' '}
                    </div>
                  </div>
                  <img src='./assets/lower4.png' width='47%' height='80%' alt='' />
                </div>
                <div className={styles.lowerSubContainer}>
                  <img src='./assets/lower5.png' width='47%' height='80%' alt='' />
                  <div className={styles.textContainer}>
                    <div className={styles.highlightedtxt}>Who can join class?</div>
                    <div className={styles.text}>
                      Our classes are limited 8 participants with children. Bring your friends, cousins, team, band and experience the magic!{' '}
                    </div>
                  </div>
                </div>
                <div className={styles.lowerSubContainer}>
                  <div className={styles.textContainer}>
                    <div className={styles.highlightedtxt}>Why enroll in the 8 week interactive program?</div>
                    <div className={styles.text}>Introduce music, have fun and try new and creative ways to interact with your little ... </div>
                  </div>
                  <img src='./assets/lower6.png' width='47%' height='80%' alt='' />
                </div>
                <div className={styles.lowerSubContainer}>
                  <img src='./assets/lower7.png' width='47%' height='80%' alt='' />
                  <div className={styles.textContainer}>
                    <div className={styles.highlightedtxt}>Who can join class?</div>
                    <div className={styles.text}>Music Fun with your Little One is an 8 week interactive program:</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.rightsideBanner}>
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
              <div className={styles.btnContainer}>{this.props.children}</div>
              <div className={styles.rightsideBannerSubText}>Parents, grandparents, Uncles & Aunts can enjoy Music Fun with their Little one.</div>
              <div className={styles.rightsideBannerSubText}>Schools can add our enrichment program to their ciriculum.</div>
              <div className={styles.rightsideBannerSubText}>Our program has no boundaries, students can participate from anywhere in the world.</div>
              <div className={styles.rightsideBannerSubText}>Learn about many aspects of music before choosing a single instrument.</div>
              <div className={styles.rightsideBannerSubText}>Learn to be confident about communicating with others.</div>
              <div className={styles.rightsideBannerSubText}>Build a positive attitude through our music journey.</div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(Home);

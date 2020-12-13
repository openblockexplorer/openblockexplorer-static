/**
 * @file AboutPage
 * @copyright Copyright (c) 2018-2020 Dylan Miller and openblockexplorer contributors
 * @license MIT License
 */

import React, { Fragment } from "react";
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {
  Button,
  Grid,
  Paper,
  SvgIcon,
  Typography
} from '@material-ui/core';
import { duration, easing } from '@material-ui/core/styles/transitions';
import MailIcon from '@material-ui/icons/MailOutline';
import { Parallax } from 'react-parallax';
import Fade from 'react-reveal/Fade';
import Flip from 'react-reveal/Flip';
import LightSpeed from 'react-reveal/LightSpeed';
import { TwitterTimelineEmbed } from 'react-twitter-embed';
import CoinbaseCommerceButton from 'react-coinbase-commerce';
import 'react-coinbase-commerce/dist/coinbase-commerce-button.css';
import TrackablePage from '../TrackablePage/TrackablePage';
import SymbolD3 from '../SymbolD3/SymbolD3';
import ImageLinkGrid from '../ImageLinkGrid/ImageLinkGrid';
import { Breakpoints } from '../../utils/breakpoint';
import Constants from '../../constants';
import bannerXHorizon from './banner-x-horizon.png';
import openBlockExplorerLogo from './open-block-explorer-logo-large.png';
import apolloLogoDark from './apollo-logo-dark-mode.png';
import apolloLogoLight from './apollo-logo-light-mode.png';
import githubOctocat from './github-octocat.png';
import graphqlLogo from './graphql-logo.png';
import materialUiLogo from './material-ui-logo.png';
import mySqlLogo from './mysql-logo.png';
import nomicsLogoDark from './nomics-logo-dark-mode.png';
import nomicsLogoLight from './nomics-logo-light-mode.png';
import prismaLogoDark from './prisma-logo-dark-mode.png';
import prismaLogoLight from './prisma-logo-light-mode.png';
import reactLogo from './react-logo-text.png';
import styledComponentsLogoDark from './styled-components-logo-dark-mode.png';
import styledComponentsLogoLight from './styled-components-logo-light-mode.png';

const PaperParallax = styled(Paper)`
  && {
    background: ${props => props.theme.colorBodyBackground};
    /* Allows shadow to overlap the element below it. */
    position: relative;
  }
`;

const GridParallax = styled(Grid)`
  && {
    height: 280px;
    ${({ breakpoint }) =>
      breakpoint === Breakpoints.XS && `
        height: 200px;       
      `
    }
  }
`;

const TypographyParallax = styled(Typography)`
  && {
    font-family: ${Constants.FONT_PRIMARY};
    font-size: ${Constants.MATERIAL_FONT_SIZE_H4};
    font-weight: 200;
    color: ${props => props.theme.colorAboutHeaderText};  
    ${({ breakpoint }) =>
      ((breakpoint === Breakpoints.XL || breakpoint === Breakpoints.LG) && `
        padding-left: ${Constants.ABOUT_PAGE_MARGIN_LG + 'px'};
        padding-right: ${Constants.ABOUT_PAGE_MARGIN_LG + 'px'};
      `) ||
      (breakpoint === Breakpoints.MD && `
        padding-left: ${Constants.ABOUT_PAGE_MARGIN_MD + 'px'};
        padding-right: ${Constants.ABOUT_PAGE_MARGIN_MD + 'px'};
      `) ||
      (breakpoint === Breakpoints.SM && `
        padding-left: ${Constants.ABOUT_PAGE_MARGIN_SM + 'px'};
        padding-right: ${Constants.ABOUT_PAGE_MARGIN_SM + 'px'};
      `) ||
      (breakpoint === Breakpoints.XS && `
        padding-left: ${Constants.ABOUT_PAGE_MARGIN_XS + 'px'};
        padding-right: ${Constants.ABOUT_PAGE_MARGIN_XS + 'px'};
        font-size: ${Constants.MATERIAL_FONT_SIZE_H5};
      `)
    }
  }
`;

const GridSection = styled(Grid)`
  && {
    padding-top: 96px;
    padding-bottom: 96px;
    transition: ${'padding ' + duration.standard + 'ms ' + easing.easeInOut};
    ${({ breakpoint }) =>
      ((breakpoint === Breakpoints.XL || breakpoint === Breakpoints.LG) && `
        padding-left: ${Constants.ABOUT_PAGE_MARGIN_LG + 'px'};
        padding-right: ${Constants.ABOUT_PAGE_MARGIN_LG + 'px'};
      `) ||
      (breakpoint === Breakpoints.MD && `
        padding-left: ${Constants.ABOUT_PAGE_MARGIN_MD + 'px'};
        padding-right: ${Constants.ABOUT_PAGE_MARGIN_MD + 'px'};
      `) ||
      (breakpoint === Breakpoints.SM && `
        padding-left: ${Constants.ABOUT_PAGE_MARGIN_SM + 'px'};
        padding-right: ${Constants.ABOUT_PAGE_MARGIN_SM + 'px'};
      `) ||
      (breakpoint === Breakpoints.XS && `
        padding-top: 64px;
        padding-bottom: 64px;
        padding-left: ${Constants.ABOUT_PAGE_MARGIN_XS + 'px'};
        padding-right: ${Constants.ABOUT_PAGE_MARGIN_XS + 'px'};
      `)
    }
  }
`;

const GridSectionPrimary = styled(GridSection)`
  && {
    background: ${props => props.theme.colorAboutBackgroundPrimary};
  }
`;

const GridSectionSecondary = styled(GridSection)`
  && {
    background: ${props => props.theme.colorAboutBackgroundSecondary};
  }
`;

const GridItem = styled(Grid)`
  && {
    ${({ breakpoint }) =>
      ((breakpoint === Breakpoints.XL || breakpoint === Breakpoints.LG) && `
        width: calc(50% - ${Constants.ABOUT_PAGE_MARGIN_LG/2 + 'px'});
      `) ||
      (breakpoint === Breakpoints.MD && `
        width: calc(50% - ${Constants.ABOUT_PAGE_MARGIN_MD/2 + 'px'});
      `) ||
      ((breakpoint === Breakpoints.SM || breakpoint === Breakpoints.XS) && `
        width: 100%;
      `)
    }
  }
`;

const GridImageLeft = styled(GridItem)`
  && {
    order: 1;
  }
`;

const GridImageRight = styled(GridItem)`
  && {
    order: 2;
    ${({ breakpoint }) =>
      (breakpoint === Breakpoints.SM || breakpoint === Breakpoints.XS) && `
        order: 1;
      `
    }
  }
`;

const GridSymbolLeft = styled(GridImageLeft)`
  && {
    ${({ breakpoint }) =>
      breakpoint === Breakpoints.XS && `
        margin-top: -32px;
        margin-bottom: -32px;     
      `
    }
  }
`;

const GridText = styled(GridItem)`
  && {
    ${({ breakpoint }) =>
    (breakpoint === Breakpoints.SM || breakpoint === Breakpoints.XS) && `
        margin-top: 48px;
      `
    }
  }
`;

const GridTextLeft = styled(GridText)`
  && {
    order: 1;
    ${({ breakpoint }) =>
      (breakpoint === Breakpoints.SM || breakpoint === Breakpoints.XS) && `
        order: 2;
      `
    }
  }
`;

const GridTextRight = styled(GridText)`
  && {
    order: 2;
    ${({ breakpoint }) =>
      (breakpoint === Breakpoints.SM || breakpoint === Breakpoints.XS) && `
        order: 2;
      `
    }
  }
`;

const TypographyHeading = styled(Typography)`
  && {
    font-family: ${Constants.FONT_PRIMARY};
    font-size: ${Constants.MATERIAL_FONT_SIZE_H4};
    font-weight: 300;
    color: ${props => props.theme.colorBodyText};
    ${({ breakpoint }) =>
      breakpoint === Breakpoints.XS && `
        font-size: ${Constants.MATERIAL_FONT_SIZE_H5};       
      `
    }
  }
`;

// From the Material Design documentation: "The ideal length for legibility of body copy is 40-60
// characters per line."
const TypographyBody = styled(Typography)`
  && {
    font-family: ${Constants.FONT_PRIMARY};
    font-size: ${Constants.MATERIAL_FONT_SIZE_BODY_1};
    line-height: 1.75rem;
    color: ${props => props.theme.colorBodyTextDim};
  }
`;

const StyledA = styled.a`
  && {
    color: ${props => props.theme.colorBodyTextLink};
    text-decoration: none;
    &:hover {
      cursor: pointer;
      text-decoration: underline;
    }
  }
`;

const ImgSection = styled.img`
  && {
    max-width: 100%;
    max-height: 300px;
  }
`;

const ButtonSubscribe = styled(Button)`
  && {
    height: 48px;
    border-radius: 24px;
    margin-top: 24px;
    padding-left: 24px;
    padding-right: 24px;
    font-family: ${Constants.FONT_PRIMARY};
    font-size: ${Constants.MATERIAL_FONT_SIZE_BUTTON};
    font-weight: 400;
    text-transform: capitalize;
    background: ${props => props.theme.colorBodyButtonBackground};
    color: ${props => props.theme.colorBodyButtonText};
    &:hover {
      background: ${props => props.theme.colorBodyButtonHoverBackground};
      color: ${props => props.theme.colorBodyButtonHoverText};
    }    
  }
`;

const MailIconButton = styled(MailIcon)`
  && {
    margin-right: 14px;
  }
`;

const SpanHeart = styled.span`
  && {
    color: ${props => props.theme.colorBodyTextLink};
  }
`;

const ButtonDonate = styled(CoinbaseCommerceButton)`
  && {
    height: 48px;
    border: none;
    border-radius: 24px;
    margin-top: 24px;
    padding-left: 24px;
    padding-right: 24px;
    font-family: ${Constants.FONT_PRIMARY};
    font-size: ${Constants.MATERIAL_FONT_SIZE_BUTTON};
    font-weight: 400;
    background: ${props => props.theme.colorBodyButtonBackground};
    color: ${props => props.theme.colorBodyButtonText};
    &:hover {
      cursor: pointer;
      background: ${props => props.theme.colorBodyButtonHoverBackground};
      color: ${props => props.theme.colorBodyButtonHoverText};
    }    
  }
`;

const SvgIconButton = styled(SvgIcon)`
  && {
    margin-right: 14px;
  }
`;

const PaperTwitter = styled(Paper)`
  && {
    background: ${props => props.theme.colorAboutTwitterBackground};
    ${({ breakpoint }) =>
      (breakpoint === Breakpoints.SM || breakpoint === Breakpoints.XS) && `
        max-width: 640px;
        margin: auto;
      `
    }
  }
`;

const ImageLinkGridThanks = styled(ImageLinkGrid)`
  && {
    margin-top: ${Constants.ABOUT_PAGE_PROJECT_ICONS_HEIGHT/2 + 'px'};
  }
`;

/**
 * Component for the about page.
 */
class AboutPage extends TrackablePage {
  static propTypes = {
    /**
     * The current Breakpoint, taking the desktop drawer (large screens) width into account.
     */    
    breakpoint: PropTypes.number.isRequired,
    /**
     * True if the desktop drawer (large screens) is open.
     */    
    isDesktopDrawerOpen: PropTypes.bool.isRequired,
    /**
     * True is the theme is dark, false if the theme is light.
     */
    isThemeDark: PropTypes.bool.isRequired
  };

  /**
   * Return a reference to a React element to render into the DOM.
   * @return {Object} A reference to a React element to render into the DOM.
   * @public
   */
  render() {
    return (
      <div>
        {this.getHeader()}
        {this.getSectionMission()}
        {this.getSectionOpenSource()}
        {this.getSectionCommunity()}
        {this.getSectionContributors()}
        {this.getSectionThanks()}
      </div>
    );
  }

  /**
   * Return the elements for the header based on the current breakpoint.
   * @return {Object} The elements for the header based on the current breakpoint.
   * @private
   */
  getHeader()
  {
    const { breakpoint } = this.props;

    return (
      <PaperParallax elevation={2}>
        <Fade timeout={1200}>
          <Parallax bgImage={bannerXHorizon} bgImageAlt='banner' bgImageStyle={{marginTop: '-100px'}} strength={500}>
            <GridParallax container direction='column' justify='center' alignItems='flex-start' breakpoint={breakpoint}>
              <Grid item>
                <TypographyParallax breakpoint={breakpoint}>
                  An open-source block explorer prototype.
                </TypographyParallax>
              </Grid>
            </GridParallax>
          </Parallax>
        </Fade>
      </PaperParallax>
    );
  }

  /**
   * Return the elements for the Mission section based on the current breakpoint.
   * @return {Object} The elements for the Mission section based on the current breakpoint.
   * @private
   */
  getSectionMission()
  {
    const { breakpoint, isThemeDark } = this.props;

    return (
      <GridSectionPrimary container direction='row' justify='space-between' alignItems='center' breakpoint={breakpoint}>
        <GridSymbolLeft item breakpoint={breakpoint}>
          <Grid container direction='row' justify='center' alignItems='center'>
            <SymbolD3
              width={this.getSymbolD3Width()}
              isThemeDark={isThemeDark}
              circleMode={true}
            />
          </Grid>
        </GridSymbolLeft>
        <GridTextRight item breakpoint={breakpoint}>
          <Fade bottom timeout={500}>
            <TypographyHeading breakpoint={breakpoint}>
              Mission
            </TypographyHeading>
            <br />
            <TypographyBody>
              {'Our mission is to provide a bridge between you and the blockchain, '}
              {'allowing you to easily search for and retrieve information '}
              {'which is useful in a format that is understandable, with everything you want to '}
              {'know right at your fingertips.'}
            </TypographyBody>
          </Fade>
        </GridTextRight>
      </GridSectionPrimary>
    );
  }

  /**
   * Return the elements for the Open Source section based on the current breakpoint.
   * @return {Object} The elements for the Open Source section based on the current breakpoint.
   * @private
   */
  getSectionOpenSource()
  {
    const { breakpoint } = this.props;

    return (
      <GridSectionSecondary container direction='row' justify='space-between' alignItems='center' breakpoint={breakpoint}>
        <GridTextLeft item breakpoint={breakpoint}>
          <Fade bottom timeout={500}>
            <TypographyHeading breakpoint={breakpoint}>
              Open, Transparent, Trusted
            </TypographyHeading>
            <br />
            <TypographyBody>
              {'Open Block Explorer is an open-source project under the '}
              <StyledA href={Constants.URI_GITHUB_MIT_LICENSE} target='_blank' rel='noopener noreferrer'>MIT license</StyledA>
              {', providing transparency, reliability, and security.'}
            </TypographyBody>
            <br />
            <TypographyBody>
              {'We believe that all block explorers of public blockchains should be open source. '}
              {'If you’re going to trust a block explorer to provide timely, accurate, and '}
              {'uncensored information, the code should be open for all to see.'}
            </TypographyBody>
          </Fade>
        </GridTextLeft>
        <GridImageRight item breakpoint={breakpoint}>
          <Grid container direction='row' justify='center' alignItems='center'>
            <Flip right timeout={800}>
              <ImgSection
                src={openBlockExplorerLogo}
                alt='logo'>
              </ImgSection>
            </Flip>
          </Grid>
        </GridImageRight>
      </GridSectionSecondary>
    );
  }

  /**
   * Return the elements for the Community section based on the current breakpoint.
   * @return {Object} The elements for the Community section based on the current breakpoint.
   * @private
   */
  getSectionCommunity()
  {
    const { breakpoint, isThemeDark } = this.props;

    const theme = isThemeDark ? 'dark' : 'light';
    return (
      <GridSectionPrimary container direction='row' justify='space-between' alignItems='center' breakpoint={breakpoint}>
        <GridImageLeft item breakpoint={breakpoint}>
          <Fade timeout={2000}>
            {/* Twitter card looks better at elevation 2 than 1, since card/body are same color. */}
            <PaperTwitter elevation={2} breakpoint={breakpoint}>
              <TwitterTimelineEmbed
                sourceType='profile'
                screenName='dylancm4'
                theme={theme}
                options={{height: 432}}
                // Setting key here is a bit of a hack. Since TwitterTimelineEmbed only uses the theme
                // prop when it mounts, the TwitterTimelineEmbed theme will not change if the user changes
                // the theme after the page has loaded. By setting key to the theme string, we can force a
                // remount of TwitterTimelineEmbed when the theme changes, so that it picks up the change
                // to its theme prop. 
                key={theme}
                noFooter
                transparent
              />
            </PaperTwitter>
          </Fade>
        </GridImageLeft>
        <GridTextRight item breakpoint={breakpoint}>
          <Fade bottom timeout={500}>
            <TypographyHeading breakpoint={breakpoint}>
              Community
            </TypographyHeading>
            <br />
            <TypographyBody>
              {'Follow '}
              <StyledA href={Constants.URI_TWITTER_OPEN_BLOCK_EXPLORER} target='_blank' rel='noopener noreferrer'>@dylancm4</StyledA>
              {' on Twitter to learn about the latest project news.'}
            </TypographyBody>
            <br />
            <TypographyBody>
              {'Learn more about our project on '}
              <StyledA href={Constants.URI_GITHUB_OPEN_BLOCK_EXPLORER_PROJECT} target='_blank' rel='noopener noreferrer'>GitHub</StyledA>
              {' and in our '}
              <StyledA href={Constants.URI_GITHUB_OPEN_BLOCK_EXPLORER_WIKI} target='_blank' rel='noopener noreferrer'>wiki</StyledA>
              {'.'}
            </TypographyBody>
            { Constants.IS_STATIC_MODE ?
              <Fragment /> :
              <Fragment>
                <br />
                <TypographyBody>
                  {'Join our mailing list today to stay up to date on development of our project. '}
                  {'We’ll let you know when Open Block Explorer goes live with real blockchain data.'}
                </TypographyBody>
                {/* Begin MailChimp Signup Form */}
                <form action='https://dfinityexplorer.us18.list-manage.com/subscribe/post?u=059dc252f5f0cea2fec413c42&amp;id=4ebbd6c248' method='post' id='mc-embedded-subscribe-form' name='mc-embedded-subscribe-form' className='validate' target='_blank' rel='noopener noreferrer' noValidate>
                  {/* real people should not fill this in and expect good things - do not remove this or risk form bot signups  */}
                  <div style={{ position: 'absolute', left: '-5000px' }} aria-hidden='true'>
                    <input type='text' name='b_059dc252f5f0cea2fec413c42_4ebbd6c248' tabIndex='-1' defaultValue='' />
                  </div>
                  <div className='clear'>
                    <ButtonSubscribe type='submit'>
                      <MailIconButton />
                      Join Our Mailing List
                    </ButtonSubscribe>
                  </div>
                </form>
                {/* End MailChimp Signup Form */}
              </Fragment>
            }            
          </Fade>
        </GridTextRight>
      </GridSectionPrimary>
    );
  }
  
  /**
   * Return the elements for the Contributors section based on the current breakpoint.
   * @return {Object} The elements for the Contributors section based on the current breakpoint.
   * @private
   */
  getSectionContributors()
  {
    const { breakpoint } = this.props;

    return (
      <GridSectionSecondary container
        direction='row'
        justify='space-between'
        alignItems='center'
        breakpoint={breakpoint}
      >
        <GridTextLeft item breakpoint={breakpoint}>
          <Fade bottom timeout={500}>
            <TypographyHeading breakpoint={breakpoint}>
              Contributors
            </TypographyHeading>
            <br />
            <TypographyBody>
              {'Open Block Explorer is a cooperative effort, made with '}
              <SpanHeart>♥</SpanHeart>
              {' by '}
              <StyledA href={Constants.URI_GITHUB_DYLAN} target='_blank' rel='noopener noreferrer'>@dylancm4</StyledA>
              {', '}
              <StyledA href={Constants.URI_GITHUB_TODD} target='_blank' rel='noopener noreferrer'>@toddkitchens</StyledA>
              {', and a friendly bunch of '}
              <StyledA href={Constants.URI_GITHUB_CONTRIBUTORS} target='_blank' rel='noopener noreferrer'>contributors</StyledA>
              {'.'}
            </TypographyBody>
            { Constants.IS_STATIC_MODE ?
              <Fragment /> :
              <Fragment>
                <br />
                <TypographyBody>
                  {'Make a donation to help support the project! Open-source development is powered '}
                  {'by the support of people like you.'}
                </TypographyBody>
                <ButtonDonate checkoutId={Constants.COINBASE_CHECKOUT_ID}>
                  <Grid container direction='row' justify='flex-start' alignItems='center'>
                    <Grid item>
                      <SvgIconButton>
                        <path d={Constants.ICON_SVG_PATH_BITCOIN} />
                      </SvgIconButton>
                    </Grid>
                    <Grid item>
                      Donate With Crypto
                    </Grid>
                  </Grid>
                </ButtonDonate>
              </Fragment>
            }            
          </Fade>
        </GridTextLeft>
        <GridImageRight item breakpoint={breakpoint}>
          <Grid container direction='row' justify='center' alignItems='center'>
            <LightSpeed right timeout={800}>
              <ImgSection
                src={githubOctocat}
                alt='GitHub Octocat'>
              </ImgSection>
            </LightSpeed>
          </Grid>
        </GridImageRight>
      </GridSectionSecondary>
    );
  }

  /**
   * Return the elements for the Thanks section based on the current breakpoint.
   * @return {Object} The elements for the Thanks section based on the current breakpoint.
   * @private
   */
  getSectionThanks() {
    // Possibly add: GraphQL Yoga, Recharts!!!
    const { breakpoint, isThemeDark } = this.props;
    
    // Adjust heights based on the perceived size of images (i.e., some images contain smaller logos
    // to make room for the text, so those images need to be enlarged).
    const reactHeight = Constants.ABOUT_PAGE_PROJECT_ICONS_HEIGHT * 1.3;
    const styledComponentsHeight = Constants.ABOUT_PAGE_PROJECT_ICONS_HEIGHT * 1.4;
    const materialUiHeight = Constants.ABOUT_PAGE_PROJECT_ICONS_HEIGHT;
    const nomicsHeight = Constants.ABOUT_PAGE_PROJECT_ICONS_HEIGHT * 0.9;
    const apolloHeight = Constants.ABOUT_PAGE_PROJECT_ICONS_HEIGHT;
    const graphqlHeight = Constants.ABOUT_PAGE_PROJECT_ICONS_HEIGHT * 1.4;
    const prismaHeight = Constants.ABOUT_PAGE_PROJECT_ICONS_HEIGHT;
    const mySqlHeight = Constants.ABOUT_PAGE_PROJECT_ICONS_HEIGHT * 1.2;

    // Define the image link objects for the ImageLinkGrid.
    const imageLinks = [
      {
        src: reactLogo,
        height: reactHeight,
        alt: 'React logo',
        href: Constants.URI_ABOUT_REACT
      },
      {
        src: isThemeDark ? styledComponentsLogoDark : styledComponentsLogoLight,
        height: styledComponentsHeight,
        alt: 'Styled Components logo',
        href: Constants.URI_ABOUT_STYLED_COMPONENTS
      },
      {
        src: materialUiLogo,
        height: materialUiHeight,
        alt: 'Material-UI logo',
        href: Constants.URI_ABOUT_MATERIAL_UI
      },
      {
        src: isThemeDark ? nomicsLogoDark : nomicsLogoLight,
        height: nomicsHeight,
        alt: 'Nomics logo',
        href: Constants.URI_ABOUT_NOMICS
      },
      {
        src: isThemeDark ? apolloLogoDark : apolloLogoLight,
        height: apolloHeight,
        alt: 'Apollo logo',
        href: Constants.URI_ABOUT_APOLLO
      },
      {
        src: graphqlLogo,
        height: graphqlHeight,
        alt: 'GraphQL logo',
        href: Constants.URI_ABOUT_GRAPHQL
      },
      {
        src: isThemeDark ? prismaLogoDark : prismaLogoLight,
        height: prismaHeight,
        alt: 'Prisma logo',
        href: Constants.URI_ABOUT_PRISMA
      },
      {
        src: mySqlLogo,
        height: mySqlHeight,
        alt: 'MySQL logo',
        href: Constants.URI_ABOUT_MY_SQL
      }
    ];

    // Calculate images per row based on the current breakpoint.
    let imagesPerRow;
    switch (breakpoint) {
      case Breakpoints.XS:
        imagesPerRow = 1;
        break;
      case Breakpoints.SM:
        imagesPerRow = 2;
        break;
      default:
        imagesPerRow = 3;
        break;
    }

    return (
      <GridSectionPrimary container
        direction='column'
        justify='flex-start'
        alignItems='stretch'
        breakpoint={breakpoint}
      >
        <Grid container direction='row' justify='center' alignItems='center'>
          <Grid item>
            <Fade bottom timeout={500}>
              <TypographyHeading breakpoint={breakpoint}>Special thanks to:</TypographyHeading>
            </Fade>
          </Grid>
        </Grid>
        <Grid item>
          <ImageLinkGridThanks
            imageLinks={imageLinks}
            perRow={imagesPerRow}
            justifyRow={breakpoint === Breakpoints.XS ? 'center' : 'space-between'}
            marginBetweenRows={Constants.ABOUT_PAGE_PROJECT_ICONS_HEIGHT / 2}
          />
        </Grid>
      </GridSectionPrimary>
    );
  }

  /**
   * Return the width of the SymbolD3 component based on the current breakpoint.
   * @return {Number} The width of the SymbolD3 component based on the current breakpoint.
   * @private
   */
  getSymbolD3Width() {
    const { breakpoint, isDesktopDrawerOpen } = this.props;
    const contentWidth =  window.innerWidth - (isDesktopDrawerOpen ? Constants.DRAWER_WIDTH : 0);

    let width;
    switch (breakpoint) {
      case Breakpoints.XS:
        width = contentWidth - Constants.ABOUT_PAGE_MARGIN_XS*2;
        break;
      case Breakpoints.SM:
        width = contentWidth - Constants.ABOUT_PAGE_MARGIN_SM*2;
        break;
      case Breakpoints.MD:
        width = contentWidth*0.5 - Constants.ABOUT_PAGE_MARGIN_MD*3/2;
        // This is a bit of a hack, but we scale the symbol slightly larger because it does not fill
        // its window all the way to the edges.
        width *= 1.2;
        break;
      default:
        width = contentWidth*0.5 - Constants.ABOUT_PAGE_MARGIN_LG*3/2;
        width *= 1.2;
        break;
    }
    return width;
  }
}

export default AboutPage;

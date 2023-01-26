import * as React from 'react';
import { ErrorBoundaryFallbackPage } from '@openshift-console/dynamic-plugin-sdk';

export type ErrorBoundaryFallbackProps = {
  errorMessage: string;
  componentStack: string;
  stack: string;
  title: string;
};

type ErrorBoundaryProps = React.PropsWithChildren<{
  FallbackComponent?: React.ComponentType<ErrorBoundaryFallbackProps>;
}>;

/** Needed for tests -- should not be imported by application logic */
export type ErrorBoundaryState = {
  hasError: boolean;
  error: { message: string; stack: string; name: string };
  errorInfo: { componentStack: string };
};
class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  readonly defaultState: ErrorBoundaryState = {
    hasError: false,
    error: {
      message: '',
      stack: '',
      name: '',
    },
    errorInfo: {
      componentStack: '',
    },
  };

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = this.defaultState;
  }

  componentDidCatch(
    error: ErrorBoundaryState['error'],
    errorInfo: ErrorBoundaryState['errorInfo'],
  ) {
    this.setState({
      hasError: true,
      error,
      errorInfo,
    });
    // Log the error so something shows up in the JS console when `DefaultFallback` is used.
    // eslint-disable-next-line no-console
    console.error('Caught error in a child component:', error, errorInfo);
  }

  render() {
    const { hasError, error, errorInfo } = this.state;
    const FallbackComponent = this.props.FallbackComponent || ErrorBoundaryFallbackPage;
    return hasError ? (
      <FallbackComponent
        title={error.name}
        componentStack={errorInfo.componentStack}
        errorMessage={error.message}
        stack={error.stack}
      />
    ) : (
      <>{this.props.children}</>
    );
  }
}

export default ErrorBoundary;

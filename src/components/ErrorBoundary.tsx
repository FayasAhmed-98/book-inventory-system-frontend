import React, { ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;  
}

interface State {
  hasError: boolean;
  errorMessage: string;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, State> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      errorMessage: ''
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      errorMessage: error.message
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error('Error captured in boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div>
          <h2>Something went wrong!</h2>
          <p>{this.state.errorMessage}</p>
        </div>
      );
    }

    return this.props.children; 
  }
}

export default ErrorBoundary;

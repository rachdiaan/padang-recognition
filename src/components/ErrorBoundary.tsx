import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="container min-vh-100 d-flex align-items-center justify-content-center">
                    <div className="alert alert-danger shadow-lg p-5">
                        <h1 className="h4 fw-bold border-bottom pb-3 mb-3">Something went wrong</h1>
                        <p className="mb-0">Please refresh the page or check the console.</p>
                        {this.state.error && (
                            <pre className="mt-4 bg-light p-3 rounded text-danger small border">
                                {this.state.error.toString()}
                            </pre>
                        )}
                        <button
                            className="btn btn-outline-danger mt-3"
                            onClick={() => window.location.reload()}
                        >
                            Refresh Page
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

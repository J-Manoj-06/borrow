import React, { Component } from 'react';
import logger from '../services/logger';
import { FiAlertTriangle, FiRefreshCw } from 'react-icons/fi';

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    logger.error('Unhandled UI rendering exception caught by ErrorBoundary:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0B0B0B] text-white flex items-center justify-center p-6 select-none">
          <div className="max-w-md w-full p-8 rounded-3xl bg-[#111111] border border-[#2A2A2A] text-center space-y-6 shadow-2xl">
            <div className="w-16 h-16 rounded-2xl bg-red-950/60 border border-red-800/60 text-[#EF4444] flex items-center justify-center mx-auto">
              <FiAlertTriangle className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-bold tracking-tight text-white">Something Went Wrong</h2>
              <p className="text-xs text-[#A1A1AA] leading-relaxed">
                An unexpected system exception occurred. The error has been logged and isolated by the Borrow Error Boundary.
              </p>
            </div>

            {this.state.error && (
              <div className="p-3 rounded-xl bg-[#171717] border border-[#2A2A2A] text-left overflow-x-auto text-[11px] font-mono text-red-300/90 max-h-32 scrollbar-none">
                {this.state.error.toString()}
              </div>
            )}

            <button
              type="button"
              onClick={this.handleReload}
              className="w-full py-3 px-4 rounded-xl bg-white text-black font-bold text-xs hover:bg-neutral-200 transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <FiRefreshCw className="w-4 h-4" />
              Reload Application
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

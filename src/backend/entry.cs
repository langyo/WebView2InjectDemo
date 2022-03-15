using System;
using System.IO;
using System.Windows.Forms;

namespace Demo
{
  public partial class BrowserForm : Form
  {
    private Microsoft.Web.WebView2.WinForms.WebView2 webView2Control
        = new Microsoft.Web.WebView2.WinForms.WebView2();

    public BrowserForm()
    {
      ((System.ComponentModel.ISupportInitialize)(this.webView2Control)).BeginInit();
      this.SuspendLayout();

      this.webView2Control.Location = new System.Drawing.Point(0, 0);
      this.webView2Control.Name = "webView2Control";
      this.webView2Control.Size = new System.Drawing.Size(800, 600);
      this.webView2Control.DefaultBackgroundColor = System.Drawing.Color.Transparent;

      this.webView2Control.Source = new Uri("data:text/html,<style>html,body{margin: 0px;padding: 0px;}</style><body></body>");
      this.webView2Control.NavigationCompleted
        += async (sender, e) =>
        {
          foreach (var name in typeof(Program).Assembly.GetManifestResourceNames())
          {
            var content = await (new StreamReader(
              typeof(Program).Assembly.GetManifestResourceStream(
                name)
              )).ReadToEndAsync();
            if (name.Substring(name.LastIndexOf('.')) == ".js")
            {
              await this.webView2Control.ExecuteScriptAsync(content);
            };
          }
        };

      this.webView2Control.WebMessageReceived
          += async (sender, e) =>
          {
            switch (e.TryGetWebMessageAsString())
            {
              case "openDevTools":
                await this.webView2Control.EnsureCoreWebView2Async();
                this.webView2Control.CoreWebView2.OpenDevToolsWindow();
                break;
              case "terminate":
                this.Close();
                break;
              default:
                Console.WriteLine(e.TryGetWebMessageAsString());
                break;
            }
          };

      this.ClientSize = new System.Drawing.Size(800, 600);
      this.Controls.Add(this.webView2Control);
      this.Name = "BrowserForm";
      this.Text = "BrowserForm";
      this.CenterToScreen();
      this.SizeChanged += (sender, e) =>
      {
        this.webView2Control.Width = this.Width;
        this.webView2Control.Height = this.Height;
      };
      this.FormBorderStyle = FormBorderStyle.None;
      this.AllowTransparency = true;
      ((System.ComponentModel.ISupportInitialize)(this.webView2Control)).EndInit();
      this.ResumeLayout(false);
      this.PerformLayout();
    }
  }

  static class Program
  {
    [STAThread]
    static void Main()
    {
      Application.EnableVisualStyles();
      Application.SetCompatibleTextRenderingDefault(false);
      Application.Run(new BrowserForm());
    }
  }
}

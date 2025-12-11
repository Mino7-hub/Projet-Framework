import RegisterForm from './RegisterForm';

export default function RegisterPage() {
  return (
    <main className="max-w-md mx-auto mt-20 p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4 text-center">Create account</h1>
      <RegisterForm />
      <p className="text-sm text-center mt-4">
        Already have an account?{' '}
        <a href="/login" className="text-blue-600 hover:underline">
          Sign in
        </a>
      </p>
    </main>
  );
}
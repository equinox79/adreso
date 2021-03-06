package Adreso;
use strict;
use warnings;
use Nephia;
use Adreso::Pages

our $VERSION = 0.01;

path '/' => sub {
    my $req    = shift;
    my $params = undef;

    eval {
        $params = validate(
            q   => { isa => 'Str' },
            cmd => { isa => 'Str', default => undef },
        );
    };
    if ($@) { return { title => 'adre.so', template => 'description.tx' }; }

    return &Adreso::Pages::index( $req, $params );
};

path '/bookmarklet' => sub {
    return { title => 'adre.so', template => 'bookmarklet.tx' };
};

1;
__END__

=head1 NAME

Adreso - Web Application

=head1 SYNOPSIS

  $ plackup

=head1 DESCRIPTION

Adreso is web application based Nephia.

=head1 AUTHOR

clever guy

=head1 SEE ALSO

Nephia

=head1 LICENSE

This library is free software; you can redistribute it and/or modify
it under the same terms as Perl itself.

=cut

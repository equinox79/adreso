package Adreso::Pages;
use strict;
use warnings;
use Data::Printer;
use Data::Dumper;
use Encode;
use URI::Escape;
use JSON;
use utf8;
use Plack::Response;
use Encode;

sub index {
    my ( $req, $params ) = @_;
    my $page  = {
        template => 'index.tx',
        title    => 'adre.so',
    };

    my $query = &query_parse($params->{q});
    
    if ( $query->{type} eq 'addr' ) {
        $page->{addr} = $query->{parts}[0];
	$page->{cmd}  = $params->{cmd};

	if( $page->{cmd} =~ /google/ ){
            $page = Plack::Response->new();
	    $page->redirect( 'http://maps.google.co.jp/?q=' . Encode::encode('UTF-8', $query->{parts}[0]), 301 );
	}
    }
    elsif ( $query->{type} eq 'latlon' ) {
        $page->{addr} = $query->{query_string};
    }
    else {

    }

    return $page;
}

sub query_parse {
    my ($q) = @_;
    $q = &decode( 'utf8', $q );

    my $query_obj = { parts => [], type => undef, query_string => $q };
    if ( @{ $query_obj->{parts} } =
        $q =~ /^([-]?\d+(?:\.\d+)?),([-]?\d+(?:\.\d+)?)$/ )
    {
        $query_obj->{type} = 'latlon';
    }
    elsif ( @{ $query_obj->{parts} } = $q =~ /(.+)/ ) {
        $query_obj->{type} = 'addr';
    }

    return $query_obj;
}

1
__END__
